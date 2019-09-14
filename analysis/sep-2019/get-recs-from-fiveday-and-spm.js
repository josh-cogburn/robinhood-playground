
const { pick } = require('underscore');
const stratManager = require('../../socket-server/strat-manager');
const getTrend = require('../../utils/get-trend');
const { avgArray } = require('../../utils/array-math');


const getRecsFromFiveDayAndSPM = async (fiveDay, spmAll, addTodayTrend) => {
  const combined = spmAll
    .filter(s => ['premarket', 'afterhours'].every(w => !s.strategy.includes(w)))
    .map(s => ({
      ...pick(s, ['strategy']),
      avgMax: s.playouts.onlyMax.avgTrend,
      avgFiveDay: (fiveDay.find(o => o.name === s.strategy) || {}).avgTrend
    }))
    .filter(s => s.avgMax && s.avgFiveDay)
    .filter(s => s.avgMax > 1 && s.avgFiveDay > 1)
    .map(s => ({
      ...s,
      mult: s.avgMax * s.avgFiveDay
    }))
    .sort((a, b) => b.mult - a.mult);
  
  if (!addTodayTrend) {
    return combined;
  } else {

    await stratManager.init();
    const { picks, tickerWatcher: { relatedPrices } } = stratManager;

    const withTodayTrend = combined.map(s => ({
      ...s,
      ...(() => {
        const foundPicks = picks.filter(pick => pick.stratMin === s.strategy);
        const withAvgTrend = foundPicks.map(({ withPrices }) => {
          const withTrend = withPrices.map(pick => {
            const { lastTradePrice } = relatedPrices[pick.ticker];
            return {
              ...pick,
              lastTradePrice,
              trend: getTrend(lastTradePrice, pick.price)
            };
          });
          const avgTrend = avgArray(
            withTrend.map(pick => pick.trend)
          );
          return { ...pick, avgTrend };
        });
        return { todayTrend: avgArray(withAvgTrend.map(pick => pick.avgTrend)), count: withAvgTrend.length };
      })()
    }));

    const ofInterest = withTodayTrend.filter(s => s.todayTrend);;
    
    
    strlog({
      withTodayTrend: ofInterest
    });


    const analyze = what => [5, 10, 15, 20, 25, 30].reduce((acc, count) => ({
      ...acc,
      [count]: avgArray(what.slice(0, count).map(s => s.todayTrend).filter(Boolean))
    }), {});


    strlog({ 
      ofInterest: analyze(ofInterest),
      overall: analyze(withTodayTrend)
    });

    const goodOnAllFronts = ofInterest.filter(s => s.todayTrend > 0.4);

    strlog({ goodOnAllFronts });

    strlog({ goodOnAllFronts: goodOnAllFronts.map(s => s.strategy )})

  }
};


module.exports = getRecsFromFiveDayAndSPM;