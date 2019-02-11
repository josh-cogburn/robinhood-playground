
const recordPicks = require('./record-picks');
const getTrendBreakdowns = require('./get-trend-breakdowns');

const executeStrategy = async (Robinhood, strategyFn, min, ratioToSpend, strategy, trendPermFilter) => {

    await new Promise(resolve => setTimeout(resolve, 1000 * 10));   // 10 secs

    const trendBreakdowns = await getTrendBreakdowns(Robinhood, min);

    if (trendPermFilter) {
        Object.keys(trendBreakdowns)
            .filter(trendKey => !trendPermFilter.includes(trendKey))
            .forEach(trendKey => {
                console.log('deleting', trendKey);
                delete trendBreakdowns[trendKey];
            });
    }

    for (let trendKey of Object.keys(trendBreakdowns)) {
        const trend = trendBreakdowns[trendKey];
        const toPurchase = await strategyFn(Robinhood, trend, min, trendKey);
        const trendFilterKey = (trendKey === 'under5') ? '' : trendKey;
        await recordPicks(Robinhood, strategy, min, toPurchase, trendFilterKey);
    }


};

module.exports = executeStrategy;
