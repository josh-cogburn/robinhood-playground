const StratPerf = require('../models/StratPerf');
const { mapObject } = require('underscore');
const { avgArray } = require('../utils/array-math');


module.exports = async (daysBack = 5) => {

  const allDates = await StratPerf.getUniqueDates();
  strlog({ allDates });
  
  const response = {};
  for (let date of allDates.slice(0 - daysBack)) {
    console.log({ date });
    const allStratPerfs = await StratPerf.find({ date }).lean();
    const withAnalysis = allStratPerfs.map(stratPerf => ({
      ...stratPerf,
      overallAvg: avgArray(stratPerf.perfs.map(perf => perf.avgTrend))
    }));
    strlog({
      withAnalysis: withAnalysis.length
    });
    response[date] = withAnalysis.sort((a, b) => b.overallAvg - a.overallAvg);
  }

  return response;

  
  // strlog({ allStratPerfs })
  // strlog({ count: allStratPerfs.length })

  // const byPm = allPms.reduce((acc, pmPerf) => {
  //   pmPerf.perfs.forEach(perf => {
  //     acc[perf.pmName] = [
  //       ...acc[perf.pmName] || [],
  //       perf.avgTrend
  //     ];
  //   });
  //   return acc;
  // }, {});

  // strlog({ byPm })

  // const analyzed = mapObject(byPm, avgArray);
  // return Object.keys(analyzed)
  //   .sort((a, b) => analyzed[b] - analyzed[a])
  //   .map(key => ({
  //     pm: key,
  //     avg: analyzed[key].twoDec(),
  //     count: byPm[key].length,
  //     values: byPm[key].map(n => n.twoDec())
  //   }));

  // strlog(analyzed);
};