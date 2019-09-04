const COUNT = 70;

const lookupMultiple = require('../utils/lookup-multiple');
const addFundamentals = require('../app-actions/add-fundamentals');
const allStocks = require('../json/stock-data/allStocks');
const { isTradeable } = require('../utils/filter-by-tradeable');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const getTrend = require('../utils/get-trend');
const getStSent = require('../utils/get-stocktwits-sentiment');
const { uniq, get, mapObject } = require('underscore');
const { avgArray, zScore } = require('../utils/array-math');

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


const runPennyScan = async ({
  minPrice = 0.5,
  maxPrice = 8,
  minVolume = Number.NEGATIVE_INFINITY,
  filterFn = () => true,
  includeStSent = true
} = {}) => {
  const tickers = (await getTickersBetween(minPrice, maxPrice)).map(buy => ({
    ...buy,
    computed: {}
  }));

  const withFundamentals = await addFundamentals(tickers);

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
      const avgPrice = avgArray([
        buy.fundamentals.open,
        buy.fundamentals.low,
        buy.fundamentals.high,
        buy.fundamentals.high,
        buy.quote.prevClose,
        buy.quote.currentPrice
      ]);
      return {
        ...buy,
        computed: {
          ...buy.computed,
          actualVolume: buy.fundamentals.volume,
          dollarVolume: Math.round(buy.fundamentals.volume * avgPrice),
          projectedVolume: projectedVolume.twoDec(),
          // projectedVolumeTo2WeekAvg: (projectedVolume / twoWeekAvgVol).twoDec(),
          // projectedVolumeToOverallAvg: projectedVolume / buy.fundamentals.average_volume,
        }
      };
    });

  const isPremarket = min < 0;
  const isAfterHours = min > 390;
  const irregularHours = isPremarket || isAfterHours;
  const withTSO = withProjectedVolume
    .map(buy => ({
      ...buy,
      computed: {
        ...buy.computed,
        tso: getTrend(
          buy.quote.currentPrice, 
          !irregularHours ? buy.fundamentals.open : buy.quote.lastTradePrice
        ),
        tsc: getTrend(
          buy.quote.currentPrice, 
          !irregularHours ? buy.fundamentals.prevClose : buy.quote.lastTradePrice
        ),
        tsh: getTrend(buy.quote.currentPrice, buy.fundamentals.high)
      }
    }))
    .map(buy => ({
      ...buy,
      computed: {
        ...buy.computed,
        highestTrend: Math.max(Math.abs(buy.computed.tsc), Math.abs(buy.computed.tso), Math.abs(buy.computed.tsh)),
      }
    }));

    

  const filtered = withTSO
    .filter(buy => buy.computed.projectedVolume > minVolume)
    .filter(buy => filterFn(buy.computed));

  
  // FIX MISSING 2 WEEK VOLUMES
  const missing2WeekAvg = filtered.filter(buy => !buy.fundamentals.average_volume_2_weeks);

  strlog({
    missing2WeekAvg: missing2WeekAvg.map(buy => buy.ticker)
  });
  const avgVolumes = await getAvg2WeekVolume(missing2WeekAvg.map(buy => buy.ticker));
  const fixed = filtered
    .map(buy => ({
      ...buy,
      fundamentals: {
        ...buy.fundamentals,
        average_volume_2_weeks: buy.fundamentals.average_volume_2_weeks || (() => {
          console.log('fixing 2 week volume for', buy.ticker, avgVolumes[buy.ticker]);
          return avgVolumes[buy.ticker]
        })()
      }
    }))
    .map(buy => ({
      ...buy,
      computed: {
        ...buy.computed,
        projectedVolumeTo2WeekAvg: (buy.computed.projectedVolume / buy.fundamentals.average_volume_2_weeks).twoDec(),
      }
    }))
    .filter(buy => {
      if (buy.ticker === 'AMPY') {
        strlog({ buy })
      }
      console.log(buy.computed.projectedVolumeTo2WeekAvg, !!buy.computed.projectedVolumeTo2WeekAvg, !!buy.computed.projectedVolumeTo2WeekAvg && isFinite(buy.computed.projectedVolumeTo2WeekAvg))
      return !!buy.computed.projectedVolumeTo2WeekAvg && isFinite(buy.computed.projectedVolumeTo2WeekAvg);
    });


  strlog({
    before: withProjectedVolume.length,
    after: fixed.length
  });

  const sortAndCut = (arr, sortKey, num) => {
    return arr
      .filter(buy => get(buy, sortKey))
      .sort((a, b) => {
        // console.log({
        //   b: get(b, sortKey),
        //   a: get(a, sortKey)
        // })
        return get(b, sortKey) - get(a, sortKey);
      })
      .slice(0, num)
  };

  const topVolTo2Week = sortAndCut(fixed, 'computed.projectedVolumeTo2WeekAvg', COUNT / 3);
  // const topDollarVolume = sortAndCut(fixed, 'computed.dollarVolume', 30, COUNT / 3);
  const topVolTickers = sortAndCut(fixed, 'computed.projectedVolume', COUNT);

  const volumeTickers = uniq([
    ...topVolTo2Week,
    ...topVolTickers,
  ], 'ticker');
  
  strlog({

    withProjectedVolume: withProjectedVolume.length,
    fixed: fixed.length,

    topVolTickers: topVolTickers.length,
    topVolTo2Week: topVolTo2Week.length,
    // topDollarVolume: topDollarVolume.length,
    volumeTickers: volumeTickers.length,
  });
  






  // let allHistoricals = await getMultipleHistoricals(
  //   volumeTickers.map(t => t.ticker)
  //   // `interval=day`
  // );

  // let withHistoricals = volumeTickers.map((buy, i) => ({
  //   ...buy,
  //   historicals: allHistoricals[i]
  // }));


  

  // strlog({ withHistoricals})




  // const withTwoWeekVolume = withHistoricals.map(buy => {
  //   const twoWeekAverageVolume = avgArray(
  //     buy.historicals.slice(-10).map(hist => hist.volume)
  //   );
  //   return {
  //     ...buy,
  //     computed: {
  //       ...buy.computed,
  //       twoWeekAverageVolume,
  //       projectedVolumeTo2WeekAvg: buy.computed.projectedVolume / twoWeekAverageVolume
  //     }
  //   };
  // });






  // const topVolTo2Week = sortAndCut(withTwoWeekVolume, 'computed.projectedVolumeTo2WeekAvg', 25, true);


  // const randomHotVol = [
  //   // ...topVolTo2Week,
  //   ...topVolToOverallAvg,
  // ].sort(() => Math.random() > 0.5);

  const theGoodStuff = volumeTickers.slice(0, COUNT);


  // uniq([
  //   ...randomHotVol,
  //   ...volumeTickers
  // ], 'ticker')
    // .slice(0, 70)
    // .map(({ ticker }) => 
    //   withTwoWeekVolume.find(o => o.ticker === ticker)
    // );
    
  console.log({
    // topVolTo2Week: topVolTo2Week.length,
    // randomHotVol: randomHotVol.length,
    theGoodStuff: theGoodStuff.length,
  })

  if (!includeStSent) {
    return theGoodStuff;
  }

  const withStSent = await mapLimit(theGoodStuff, 3, async buy => ({
    ...buy,
    computed: {
      ...buy.computed,
      stSent: (await getStSent(buy.ticker) || {}).bullBearScore || 0
    }
  }));
  

  return finalize(addZScores(withStSent));

};



const addZScores = array => {
  strlog({
    array
  })
  const withZScores = array.map((buy, index, arr) => ({
    ...buy,
    zScores: [
      'projectedVolume',
      'projectedVolumeTo2WeekAvg',
      'stSent',
      'highestTrend'
    ].reduce((acc, key) => ({
      ...acc,
      [key]: zScore(
        arr.map(b => b.computed[key]).filter(Boolean),
        buy.computed[key]
      ).twoDec()
    }), {})
  }));

  strlog({
    withZScores
  })

  return withZScores;
};


const finalize = array => {

  

  return array
    .map(buy => {

      const sumZScores = (keys = Object.keys(buy.zScores)) => keys.reduce((acc, key) => acc + buy.zScores[key], 0).twoDec();
      const zScoreInverseTrend = (buy.zScores.stSent - buy.zScores.highestTrend).twoDec();
      const zScoreInverseTrendPlusVol = (avgArray([
        buy.zScores.projectedVolume,
        buy.zScores.projectedVolumeTo2WeekAvg
      ]) + zScoreInverseTrend).twoDec();
      delete buy.historicals;
      return {
        ticker: buy.ticker,
        ...buy.computed,
        sumZScore: sumZScores(),
        zScoreVolume: sumZScores(['projectedVolume', 'projectedVolumeTo2WeekAvg']),
        zScoreInverseTrend,
        zScoreInverseTrendPlusVol,
      };
    })
    .map(buy => ({
      ...buy,
      stTrendRatio: (buy.stSent / buy.highestTrend).twoDec(),
    }))
    .sort((a, b) => b.zScoreInverseTrendPlusVol - a.zScoreInverseTrendPlusVol);


  };




  const getAvg2WeekVolume = async tickers => {

    let allHistoricals = await getMultipleHistoricals(
      tickers
      // `interval=day`
    );

    let tickersToHistoricals = tickers.reduce((acc, ticker, index) => ({
      ...acc,
      [ticker]: allHistoricals[index]
    }), {});

    const tickersTo2WeekAvgVol = mapObject(
      tickersToHistoricals, 
      (historicals, ticker) => {
        // if (ticker === 'CCIH') {
        //   console.log('CCIH CCIH CCIH')
        //   strlog({
        //     historicals
        //   });
        // }
        return avgArray(historicals.slice(-10).map(hist => hist.volume))
      }
    );

    strlog({ tickersTo2WeekAvgVol})

    return tickersTo2WeekAvgVol;



    // return tickers.reduce((acc, ticker) => ({
    //   ...acc,
    //   [ticker]: 
    // }))


    // const withTwoWeekVolume = withHistoricals.map(buy => {
    //   const twoWeekAverageVolume = avgArray(
    //     buy.historicals.slice(-10).map(hist => hist.volume)
    //   );
    //   return {
    //     ...buy,
    //     computed: {
    //       ...buy.computed,
    //       twoWeekAverageVolume,
    //       projectedVolumeTo2WeekAvg: buy.computed.projectedVolume / twoWeekAverageVolume
    //     }
    //   };
    // });


};

module.exports = runPennyScan;