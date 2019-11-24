const Pick = require('../../models/Pick');

const { sumArray, avgArray } = require('../../utils/array-math');
const getTrend = require('../../utils/get-trend');

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

module.exports = analyzePositions;