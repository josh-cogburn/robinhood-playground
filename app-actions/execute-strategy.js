
const recordPicks = require('./record-picks');
const getTrendBreakdowns = require('./get-trend-breakdowns');

const executeStrategy = async (Robinhood, strategyFn, min, ratioToSpend, strategy, trendFilterKey) => {

    await new Promise(resolve => setTimeout(resolve, 1000 * 5));   // 5 secs

    if (trendFilterKey === null || (trendFilterKey && !trendFilterKey.length)) {
        return strategyFn(Robinhood, null, min, null);
    }

    const trendBreakdowns = await getTrendBreakdowns(Robinhood, min);

    if (trendFilterKey) {
        Object.keys(trendBreakdowns)
            .filter(trendKey => !trendFilterKey.includes(trendKey))
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
