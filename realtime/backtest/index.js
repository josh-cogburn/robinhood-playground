const getHistoricals = require('../historicals/get');
const { handler: rsi } = require('../strategies/rsi');
const getTrend = require('../../utils/get-trend');
const { avgArray, percUp } = require('../../utils/array-math');
const { mapObject } = require('underscore');

module.exports = async () => {
  const { SPY: historicals } = await getHistoricals(['SPY'], 30, 365);
  
  let i = 0;
  const withRSI = await mapLimit(historicals, 1, async hist => {
    const allPrices = historicals.slice(0, ++i);
    const rsiResponse = await rsi({ allPrices });
    // strlog({
    //   hist,
    //   allPrices,
    //   rsiResponse
    // });
    return {
      ...hist,
      rsi: rsiResponse ? rsiResponse.data.rsi : null
    };
  });

  const analyzeHits = array => {
    return array.map((hist, index, arr) => ({
      ...hist,
      ...hist.hit && (() => {
        const { currentPrice } = hist;
        const nextIndex = index + 1;
        const followingFive = arr.slice(nextIndex, nextIndex + 3);
        if (!followingFive.length) return {};
        const analysis = {
          trendToMax: getTrend(
            Math.max(...followingFive.map(hist => hist.high)),
            currentPrice,
          ),
          trendToCloses: getTrend(
            Math.max(...followingFive.map(hist => hist.close)),
            currentPrice,
          ),
          trendToLow: getTrend(
            Math.min(...followingFive.map(hist => hist.low)),
            currentPrice,
          )
        };
        // strlog({
        //   hist,
        //   followingFive,
        //   analysis
        // })
        return {
          analysis
        };
      })()
    }));
  };

  const analyzeAnalysis = analyzed => {
    const allAnalysis = analyzed.map(hist => hist.analysis).filter(Boolean);
    // strlog({ allAnalysis })
    return Object.keys(allAnalysis[0])
      .reduce((acc, key) => {
        // console.log({ key })
        const allVals = allAnalysis
          .map(analysis => analysis[key])
          .filter(Boolean);
        return {
          ...acc,
          [key]: {
            avgArray: avgArray(allVals),
            percUp: percUp(allVals),
            count: allVals.length
          }
        };
      }, {});
  };


  const theBigAnalyze = withHits => {
    const withAnalysis = analyzeHits(withHits);
    const analysis = analyzeAnalysis(withAnalysis);
    return analysis;
  };


  const leavingRSIAlert2Away = withRSI.map((hist, index, arr) => {
    const threeAway = arr[index - 3];
    const prevHists = arr.slice(index - 2, index);

    // console.log({
    //   threeAway,
    //   prevHists
    // })
    return {
      ...hist,
      hit: [
        hist.rsi > 40,
        threeAway && threeAway.rsi < 30,
        prevHists.length === 2,
        prevHists.every(prevHist => prevHist.rsi > 30)
      ].every(val => {
        console.log(val);
        return !!val;
      })
    };

  });

  strlog({ leavingRSIAlert2Away })

  strlog(
    mapObject({

      everyRSIUnder30: withRSI.map(hist => ({
        ...hist,
        hit: hist.rsi < 30
      })),

      leavingRSIAlert: withRSI.map((hist, index, arr) => {

        const prevHist = arr[index - 1];
        return {
          ...hist,
          ...prevHist && prevHist.rsi < 30 && hist.rsi > 30 && {
            hit: true
          }
        };

      }),

      leavingRSIAlert2Away

    }, theBigAnalyze)
  );

  // strlog({ withRSI, rsiHits: rsiHits.map(hist => new Date(hist.timestamp).toLocaleString()) })
};