const lookupMultiple = require('../utils/lookup-multiple');
const addFundamentals = require('./add-fundamentals');
const allStocks = require('../json/stock-data/allStocks');
const { isTradeable } = require('../utils/filter-by-tradeable');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const getTrend = require('../utils/get-trend');
const getStSent = require('../utils/get-stocktwits-sentiment');

const getTickersBetween = async (min, max) => {
  const tickQuotes = await lookupMultiple(allStocks.filter(isTradeable).map(o => o.symbol), true);
  const tickers = Object.keys(tickQuotes).filter(ticker => {
    const { currentPrice } = tickQuotes[ticker];
    return currentPrice < max && currentPrice > min
  });
  // console.log({ kstTickers: tickers });
  return tickers.map(ticker => ({
    ticker,
    quote: tickQuotes[ticker]
  }));
};

Array.prototype.cutBottom = function(percCut = 30) {
  const length = this.length;
  const bottomAmt = length * percCut / 100;
  console.log('cutting', bottomAmt);
  return this.slice(0, length - bottomAmt);
};


module.exports = async () => {
  const tickers = (await getTickersBetween(0, 6)).map(buy => ({
    ...buy,
    computed: {}
  }));

  const withFundamentals = (
    await addFundamentals(
      tickers
    )
  )

  // .sort((a, b) => b.fundamentals.volume - a.fundamentals.volume)
  // .cutBottom();

    
  
  const min = getMinutesFrom630();
  const percComplete = Math.max(Math.min(1, min / 390), 0.01);
  console.log({
    min,
    percComplete
  });
  const withProjectedVolume = withFundamentals
    .map(buy => ({
      ...buy,
      computed: {
        ...buy.computed,
        projectedVolume: buy.fundamentals.volume / percComplete
      }
    }))
    .filter(buy => buy.computed.projectedVolume)
    .sort((a, b) => b.computed.projectedVolume - a.computed.projectedVolume)
    .cutBottom(20);


  strlog({ withProjectedVolume})
  
  const withTSO = withProjectedVolume
    .map(buy => ({
      ...buy,
      computed: {
        ...buy.computed,
        tso: getTrend(buy.quote.currentPrice, buy.fundamentals.open),
        tsc: getTrend(buy.quote.currentPrice, buy.quote.prevClose)
      }
    }))
    .filter(buy => {
      const { tso, tsc } = buy.computed;
      return [tso, tsc].every(val => val > 0 && val < 6);
    });

  let allHistoricals = await getMultipleHistoricals(
    withTSO.map(t => t.ticker)
    // `interval=day`
  );

  let withHistoricals = withTSO.map((buy, i) => ({
    ...buy,
    historicals: allHistoricals[i]
  }));


  strlog({ withHistoricals})

  const withMaxVol = withHistoricals.map(buy => ({
    ...buy,
    computed: {
      ...buy.computed,
      recentMaxVol: Math.max( // % volume compared to max in the last N days
        ...buy.historicals.slice(-20).map(hist => hist.volume)
      ),
    }
  }));

  const withPercMaxVol = withMaxVol.map(buy => ({
    ...buy,
    computed: {
      ...buy.computed,
      percMaxVol: buy.computed.projectedVolume / buy.computed.recentMaxVol
    }
  }));


  const sortedByPercMaxVol = withPercMaxVol
    .filter(buy => buy.computed.percMaxVol && buy.computed.recentMaxVol)
    .sort((a, b) => b.computed.percMaxVol - a.computed.percMaxVol)
    // .cutBottom(80)
    .slice(0, 40);


  const withStSent = (
    await mapLimit(sortedByPercMaxVol, 3, async buy => ({
      ...buy,
      stSent: (await getStSent(buy.ticker) || {}).bullBearScore
    }))
  ).filter(buy => buy.stSent > 50)
  .map(buy => {
    delete buy.historicals;
    return {
      ticker: buy.ticker,
      stSent: buy.stSent,
      ...buy.computed
    };
  });

  return withStSent;

  // const stCache = {};
  // for (let ticker of sortedByPercMaxVol.map(buy => buy.ticker)) {
  //   const score = (await getStSent(ticker) || {}).bullBearScore;
  //   if (score > 145) {
  //     stCache[ticker] = score;
  //     if (Object.keys(stCache).length >= 5) {
  //       break;
  //     }
  //   }
  // }

  // return Object.keys(stCache).map(ticker => ({
  //   ticker,
  //   stSent: stCache[ticker],
  //   ...sortedByPercMaxVol.find(buy => buy.ticker === ticker).computed
  // }));

};


