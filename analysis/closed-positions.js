const ClosedPosition = require('../models/Holds/ClosedPositions');
const DateAnalysis = require('../models/DateAnalysis');
const Hold = require('../models/Holds');
const Pick = require('../models/Pick');

const { sumArray, avgArray } = require('../utils/array-math');
const getTrend = require('../utils/get-trend');
const cTable = require('console.table');
const { alpaca } = require('../alpaca/');
const { groupBy } = require('underscore');

const analyzePositions = async collection => {
  return mapLimit(collection, 1, async position => {
    const { ticker, sells = [], buys = [] } = position;

    const numSharesSold = sumArray(
        sells.map(buy => buy.quantity)
    );
    const individualize = array => {
        const grouped = array.map(({ quantity, fillPrice }) => 
            (new Array(quantity)).fill(fillPrice)
        );
        // flatten
        return grouped.reduce((acc, arr) => [...acc, ...arr], []);
    };

    const allSells = individualize(sells);
    // const allBuys = individualize(buys);
    // console.log({ allSells });
    const avgSellPrice = avgArray(
        allSells
    );
    const allBuys = individualize(buys);
    const avgEntry = avgArray(allBuys);
    const totalBuyAmt = sumArray(allBuys);
    const sellReturnPerc = getTrend(avgSellPrice, avgEntry);
    const sellReturnDollars = (numSharesSold / 100) * sellReturnPerc * avgEntry;
    // console.log({
    //     numSharesSold,
    //     ticker
    // })
    
    const relatedPickId = buys[0].relatedPick;
    strlog({ relatedPickId, ticker })
    const relatedPick = await Pick.findOne({ _id: relatedPickId }).lean();
    if (ticker === 'KEG') {
      strlog({
        buys
      })
    }
    const date = (new Date(relatedPick.timestamp)).toLocaleDateString();
    const { pmsHit } = relatedPick;
    const interestingWords = (pmsHit || []).map(pm => pm.split('-')).flatten().uniq();
    return {
        // ...position,
        ticker,
        totalBuyAmt,
        avgEntry,
        avgSellPrice,
        sellReturnPerc,
        sellReturnDollars,
        date,
        interestingWords
    };
  });
};


const analyzeOpen = async open => {
  


  const alpacaPositions = await alpaca.getPositions();
  console.log({ alpacaPositions })
  const withPositions = await mapLimit(open, 1, position => {
    return {
      ...position,
      position: alpacaPositions.find(pos => pos.symbol === position.ticker)
    }
  });
  strlog({
    'stale tickers': withPositions.filter(pos => !pos.position).map(pos => pos.ticker)
  })



  strlog({
    delete: await Hold.find({ 
      ticker: {
        $in: withPositions.filter(pos => !pos.position).map(pos => pos.ticker)
      }
    }).remove()
  })
  return withPositions
    // .filter(({ position }) => position)
    .map(position => {
      console.log(position);
      return position;
    })
    .map(position => {
      const { 
        market_value: marketValue, 
        unrealized_pl: unrealizedPl 
      } = position.position || {};
      delete position.position;
      return {
        ...position,
        marketValue,
        netImpact: Number(position.sellReturnDollars || 0) + Number(unrealizedPl),
        // isStale: !position.position
      };
    })
    .sort((a, b) => b.netImpact - a.netImpact);
};


const saveDateAnalysis = async byDateAnalysis => {
  for (let { date, ...dateAnalysis } of byDateAnalysis) {
    await DateAnalysis.findOneAndUpdate(
      { date }, 
      dateAnalysis, 
      { upsert: true }
    );
    console.log(`updated analysis for ${date}`);
  }
};

module.exports = async () => {


  let open = await analyzePositions(await Hold.find({}).lean());
  open = await analyzeOpen(open);

  const closed = await analyzePositions(await ClosedPosition.find({}).lean());
  strlog({
    open,
    closed
  })
  console.log("OPEN")
  console.table(
    open.sort((a, b) => new Date(b.date) - new Date(a.date))
  );

  console.log("CLOSED")
  console.table(
    closed
      .sort((a, b) => Math.abs(b.sellReturnDollars) - Math.abs(a.sellReturnDollars))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );


  const combined = [
    ...open,
    ...closed
  ].map(position => ({
    ...position,
    netImpact: position.netImpact || position.sellReturnDollars
  }))
  .map(position => ({
    ...position,
    impactPerc: +(position.netImpact / position.totalBuyAmt * 100).toFixed(2)
  }));;

  const allDates = combined.map(pos => pos.date);
  
  const byDate = groupBy(combined, 'date');
  const byDateAnalysis = Object.keys(byDate).map(date => {
    const datePositions = byDate[date];
    const totalBought = sumArray(datePositions.map(pos => pos.totalBuyAmt));
    const totalImpact = sumArray(datePositions.map(pos => pos.netImpact));
    return {
      date,
      totalBought,
      percChange: +(totalImpact / totalBought * 100).toFixed(2),
      avgImpactPerc: avgArray(datePositions.map(pos => pos.impactPerc)),
      totalImpact
    }
  });
  
  await saveDateAnalysis(byDateAnalysis);
}