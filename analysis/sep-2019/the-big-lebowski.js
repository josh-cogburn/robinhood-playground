const StratPerf = require('../../models/StratPerf');
const { mapObject, chain, sortBy, uniq } = require('underscore');
const { avgArray, percUp } = require('../../utils/array-math');
const stratManager = require('../../socket-server/strat-manager');
const addTodayTrendToStrategies = require('./add-today-trend-to-strategies');
const realtimeRunner = require('../../realtime/RealtimeRunner');

module.exports = async (daysBack = 8, skipDays = 1, addTodayTrend = true) => {




  const allDates = await StratPerf.getUniqueDates();
  const datesOfInterest = allDates.slice(0, allDates.length - skipDays).slice(0 - daysBack);
  strlog({ allDates, datesOfInterest });
  
  const response = {};
  for (let date of datesOfInterest) {
    console.log({ date });
    const allStratPerfs = await StratPerf.find({ date }).lean();
    
    const withAnalysis = allStratPerfs
      .map(stratPerf => ({
        ...stratPerf,
        perfs: stratPerf.perfs.filter(({ period, avgTrend }) => {
          const validPeriod =[
            'same-day',
            // 'next-day-9'
          ].some(v => period.includes(v));
          const validTrend = Math.abs(avgTrend) < 60;
          return validPeriod && validTrend;
        })
      }))
      .map(stratPerf => ({
        ...stratPerf,
        percUp: percUp(stratPerf.perfs.map(perf => perf.avgTrend).filter(Boolean)),
        overallAvg: avgArray(stratPerf.perfs.map(perf => perf.avgTrend).filter(Boolean)),
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

  let asArray = Object.keys(byStrategy)
    .map(stratMin => {
      const trends = byStrategy[stratMin].map(v => v.overallAvg).filter(n => n !== null);
      return {
        strategyName: stratMin,
        trends: trends.map(v => v.twoDec()),
        overallAvg: avgArray(trends),
        percUp: avgArray(byStrategy[stratMin].map(v => v.percUp)),
        trendPercUp: percUp(trends),
        trendCount: trends.length,
        perfCount: byStrategy[stratMin].map(v => v.perfCount).reduce((acc, val) => acc + val, 0)
      }
      
    })
    .filter(s => ['premarket', 'afterhours'].every(w => !s.strategyName.includes(w)))
    .filter(s => s.strategyName.includes('rsi') && s.strategyName.includes('spy'))
    .sort((a, b) => b.overallAvg - a.overallAvg);

  asArray = chain(asArray).sortBy('overallAvg').sortBy('percUp').value();

  if (!addTodayTrend) return asArray;

  await realtimeRunner.init();
  const pms = realtimeRunner.getPms();

  strlog({ pms, skipDays })
  

  const withTodayTrend = (await addTodayTrendToStrategies(asArray))
    // .filter(t => t.strategyName.includes('spy'))
    // .filter(s => s.count >= 2)
    // .filter(s => s.todayCount <= 3 && s.todayCount);


  strlog('---------------------------');
  strlog('STRATEGIES WITH TODAY TREND')
  strlog('---------------------------')

  const highestPercUp = withTodayTrend.sort((a, b) => b.percUp - a.percUp);
  const mult = withTodayTrend
    .map(s => ({
      ...s,
      mult: s.overallAvg * s.percUp
    }))
    .filter(s => s.mult)
    .sort((a, b) => b.mult - a.mult);

  strlog({
    withTodayTrend,
    highestPercUp: highestPercUp.slice(0, 30),
    multi: mult.slice(0, 40)
  })

  const stratMatchesPm = (pm, strat) => {
    return pm.some(parts => {
        parts = Array.isArray(parts) ? parts : [parts];
        return parts.every(part => strat.includes(part));
    });
  };

  const pmPerfs = stratManager.calcPmPerfs();
  // strlog({ pmPerfs })
  const organized = Object.keys(pms)
    .map(pm => {

      const stratTrends = asArray
        .filter(({ strategyName }) => stratMatchesPm(pms[pm], strategyName));

      return {
        pm,
        trends: stratTrends.map(o => o.trends).flatten(),
        weightedAvg: avgArray(
          stratTrends
            .map(({ overallAvg, count }) => Array(count).fill(overallAvg))
            .flatten()
            .filter(Boolean)
        ),
        avgAllTrends: avgArray(stratTrends.map(o => o.trends).flatten().filter(Boolean)),
        count: stratTrends.length,
        todayTrend: (pmPerfs.find(({ pmName }) => pmName === pm) || {}).avgTrend
      };

    })
    .filter(s => s.avgAllTrends)
    .sort((a, b) => b.avgAllTrends - a.avgAllTrends);

  const successfulPms = organized
    // .filter(s => s.trends)
    // .filter(s => s.count < 20 && s.count > 1);

  strlog('---------------------------')
  strlog("PMS WITH TODAY TREND")
  strlog('---------------------------')
  
  
  strlog({ successfulPms })



  strlog('---------------------------')
  strlog('RECOMMENDATIONS FOR TOMORROW')
  strlog('---------------------------')

  strlog(mapObject({
    strategies: uniq(
      [withTodayTrend, highestPercUp].flatten(),
      s => s.strategyName
    )
      // .filter(s => s.trends.every(t => t > 0))
      .filter(s => s.trendCount > 2)
      // .filter(s => s.trendPercUp > 50)
      .filter(s => s.todayCount === 1)
      .filter(s => s.todayTrend > 0.5)
      .sort((a, b) => b.overallAvg - a.overallAvg),
    pms: successfulPms
      // .filter(t => t.todayTrend > -0.2)
  }, s => s
    .slice(0, 200))
  )

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