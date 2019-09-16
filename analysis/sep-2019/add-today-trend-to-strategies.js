const stratManager = require('../../socket-server/strat-manager');
const getTrend = require('../../utils/get-trend');
const { avgArray } = require('../../utils/array-math');

module.exports = async (strategies) => {

  await stratManager.init();
  const { picks, tickerWatcher: { relatedPrices } } = stratManager;
  strlog({ strategies })
  const withTodayTrend = strategies.map(s => ({
    ...s,
    ...(() => {
      const foundPicks = picks.filter(pick => pick.stratMin === s.strategyName);
      const withAvgTrend = foundPicks.map(outsidePick => {
        const { withPrices } = outsidePick;
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
        return { ...outsidePick, avgTrend };
      });
      return { todayTrend: avgArray(withAvgTrend.map(pick => pick.avgTrend)), todayCount: withAvgTrend.length };
    })()
  }));
  return withTodayTrend;

};