const lookupMultiple = require('../utils/lookup-multiple');
const addFundamentals = require('../app-actions/add-fundamentals');
const allStocks = require('../json/stock-data/allStocks');
const { isTradeable } = require('../utils/filter-by-tradeable');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const getTrend = require('../utils/get-trend');
const getStSent = require('../utils/get-stocktwits-sentiment');
const { uniq, get } = require('underscore');

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


module.exports = async () => {
  const tickers = (await getTickersBetween(0, 8)).map(buy => ({
    ...buy,
    computed: {}
  }));

  const withFundamentals = (
    await addFundamentals(
      tickers
    )
  );

  // .sort((a, b) => b.fundamentals.volume - a.fundamentals.volume)
  // .cutBottom();

    
  
  const min = getMinutesFrom630();
  const percComplete = Math.max(Math.min(1, min / 390), 0.01);
  // console.log({
  //   min,
  //   percComplete
  // });
  const withProjectedVolume = withFundamentals
    .map(buy => {
      const projectedVolume = buy.fundamentals.volume / percComplete;
      return {
        ...buy,
        computed: {
          ...buy.computed,
          projectedVolume,
          projectedVolumeTo2WeekAvg: projectedVolume / buy.fundamentals.average_volume_2_weeks,
          projectedVolumeToOverallAvg: projectedVolume / buy.fundamentals.average_volume,
        }
      };
    })
    .filter(buy => buy.computed.projectedVolume > 25000);
  
  const sortAndCut = (arr, sortKey, percent, actuallyTop) => {
    return arr
      .filter(buy => get(buy, sortKey))
      .sort((a, b) => {
        // console.log({
        //   b: get(b, sortKey),
        //   a: get(a, sortKey)
        // })
        return get(b, sortKey) - get(a, sortKey);
      })
      .cutBottom(percent, actuallyTop)
  };

  const topVolTickers = sortAndCut(withProjectedVolume, 'computed.projectedVolume', 20, true);
  const topVolTo2Week = sortAndCut(withProjectedVolume, 'computed.projectedVolumeTo2WeekAvg', 25, true);
  const topVolToOverallAvg = sortAndCut(withProjectedVolume, 'computed.projectedVolumeToOverallAvg', 30, true);
  
  const volumeTickers = uniq([
    ...topVolTickers,
    ...topVolTo2Week,
    ...topVolToOverallAvg
  ], 'ticker');
  
  strlog({

    topVolTickers: topVolTickers.length,
    topVolTo2Week: topVolTo2Week.length,
    topVolToOverallAvg: topVolToOverallAvg.length,
    volumeTickers: volumeTickers.length,
    withProjectedVolume: withProjectedVolume.length

  });


  
  const withTSO = volumeTickers
    .map(buy => ({
      ...buy,
      computed: {
        ...buy.computed,
        tso: getTrend(buy.quote.currentPrice, buy.fundamentals.open),
        tsc: getTrend(buy.quote.currentPrice, buy.quote.prevClose),
        tsh: getTrend(buy.quote.currentPrice, buy.fundamentals.high)
      }
    }))
    .filter(buy => {
      const { tso, tsc } = buy.computed;
      return [tso, tsc].some(val => val < -7);
    });
  
  // strlog({
  //   before: volumeTickers.length,
  //   after: withTSO.length
  // });
  let allHistoricals = await getMultipleHistoricals(
    withTSO.map(t => t.ticker)
    // `interval=day`
  );

  let withHistoricals = withTSO.map((buy, i) => ({
    ...buy,
    historicals: allHistoricals[i]
  }));


  // strlog({ withHistoricals})

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
    .cutBottom(30, true);

    strlog({
      sortedByPercMaxVol: sortedByPercMaxVol.length
    })

  const withStSent = (
    await mapLimit(sortedByPercMaxVol, 3, async buy => ({
      ...buy,
      stSent: (await getStSent(buy.ticker) || {}).bullBearScore
    }))
  )
  .sort((a, b) => b.stsent - a.stSent)
  .map(buy => {
    delete buy.historicals;
    return {
      ticker: buy.ticker,
      stSent: buy.stSent,
      highestTrend: Math.max(Math.abs(buy.computed.tsc), Math.abs(buy.computed.tso), Math.abs(buy.computed.tsh)),
      ...buy.computed
    };
  })
  .map(buy => ({
    ...buy,
    stTrendRatio: buy.stSent / buy.highestTrend
  }));

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


