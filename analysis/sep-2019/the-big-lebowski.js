const StratPerf = require('../../models/StratPerf');
const { mapObject } = require('underscore');
const { avgArray, percUp } = require('../../utils/array-math');
const stratManager = require('../../socket-server/strat-manager');
const addTodayTrendToStrategies = require('./add-today-trend-to-strategies');
const realtimeRunner = require('../../realtime/RealtimeRunner');

module.exports = async (daysBack = 8, skipDays = 1, addTodayTrend = true) => {




  const allDates = await StratPerf.getUniqueDates();
  strlog({ allDates });
  
  const response = {};
  for (let date of allDates.slice(0, allDates.length - skipDays).slice(0 - daysBack)) {
    console.log({ date });
    const allStratPerfs = await StratPerf.find({ date }).lean();
    
    const withAnalysis = allStratPerfs
      .map(stratPerf => ({
        ...stratPerf,
        perfs: stratPerf.perfs.filter(({ period, avgTrend }) => {
          const validPeriod = ['next'].some(v => period.includes(v));
          const validTrend = Math.abs(avgTrend) < 60;
          return validPeriod && validTrend;
        })
      }))
      .map(stratPerf => ({
        ...stratPerf,
        percUp: percUp(stratPerf.perfs.map(perf => perf.avgTrend)),
        overallAvg: avgArray(stratPerf.perfs.map(perf => perf.avgTrend)),
        perfCount: stratPerf.perfs.length
      }));
    // strlog({
    //   withAnalysis: withAnalysis
    // });
    response[date] = withAnalysis.sort((a, b) => b.overallAvg - a.overallAvg);
  }


  const byStrategy = Object.keys(response).reduce((acc, date) => {


    response[date].forEach(({ stratMin, overallAvg, percUp, perfCount }) => {
      acc[stratMin] = [
        ...acc[stratMin] || [],
        {
          overallAvg,
          percUp,
          perfCount
        }
      ];
    });
    return acc;
  }, {});

  const asArray = Object.keys(byStrategy)
    .map(stratMin => ({
      strategyName: stratMin,
      overallAvg: avgArray(byStrategy[stratMin].map(v => v.overallAvg)),
      percUp: avgArray(byStrategy[stratMin].map(v => v.percUp)),
      count: byStrategy[stratMin].length,
      perfCount: byStrategy[stratMin].map(v => v.perfCount).reduce((acc, val) => acc + val, 0)
    }))
    .filter(s => ['premarket', 'afterhours'].every(w => !s.strategyName.includes(w)))
    .sort((a, b) => b.overallAvg - a.overallAvg);



  if (!addTodayTrend) return asArray;

  await realtimeRunner.init();
  const pms = realtimeRunner.getPms();

  strlog({ pms, skipDays })
  

  const withTodayTrend = (await addTodayTrendToStrategies(asArray))
    .filter(t => t.strategyName.includes('pennyscan'))
    .filter(s => s.count >= 4)
    .filter(s => s.todayCount <= 2 && s.todayCount);

  strlog({
    withTodayTrend,
    highestPercUp: withTodayTrend.sort((a, b) => b.percUp - a.percUp).slice(0, 30),
    multi: withTodayTrend
      .map(s => ({
        ...s,
        mult: s.overallAvg * s.percUp
      }))
      .filter(s => s.mult)
      .sort((a, b) => b.mult - a.mult)
      .slice(0, 40)
  })

  const stratMatchesPm = (pm, strat) => {
    return pm.some(parts => {
        parts = Array.isArray(parts) ? parts : [parts];
        return parts.every(part => strat.includes(part));
    });
  }

  const pmPerfs = stratManager.calcPmPerfs();
  // strlog({ pmPerfs })
  const organized = Object.keys(pms)
    .map(pm => {

      const stratTrends = asArray
        .filter(({ strategyName }) => stratMatchesPm(pms[pm], strategyName));

      return {
        pm,
        // trends: stratTrends,
        weightedAvg: avgArray(
          stratTrends
            .map(({ overallAvg, count }) => Array(count).fill(overallAvg))
            .flatten()
            .filter(Boolean)
        ),
        count: stratTrends.length,
        todayTrend: (pmPerfs.find(({ pmName }) => pmName === pm) || {}).avgTrend
      };

    })
    .filter(s => s.weightedAvg)
    .sort((a, b) => b.weightedAvg - a.weightedAvg);

  const suggestedPms = organized
    // .filter(s => s.trends)
    .filter(s => s.count < 20 && s.count > 1);

  
  strlog({ suggestedPms })

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