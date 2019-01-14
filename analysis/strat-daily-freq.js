// predict how many picks a strategy offers / day
const stratPerfOverall = require('./strategy-perf-overall');
const createPredictionModels = require('../socket-server/create-prediction-models');

const NUM_DAYS = 20;

module.exports = async (Robinhood, dollars, ...strategies) => {
    if (!strategies.length) {
        console.log('no strategies supplied.  creating prediction models and using forPurchase');
        strategies = (
            await createPredictionModels(Robinhood)
        ).forPurchase;
    }

    const fiftyTwo = (await stratPerfOverall(Robinhood, true, NUM_DAYS, 0)).sortedByAvgTrend;
    
    console.log(JSON.stringify({ fiftyTwo }, null, 2));

    const analyzed = strategies.map(strategy => {
        const foundPerf = fiftyTwo.find(s => s.name === strategy) || {};
        return foundPerf.trends ? {
            ...foundPerf,
            dailyFreq: foundPerf.trends.length / NUM_DAYS
        } : undefined;
    });

    const totalDailyFreq = analyzed.reduce(
        (acc, trend) => 
            trend && trend.dailyFreq 
                ? acc + trend.dailyFreq : 
                acc,
        0
    );

    str(analyzed);

    return {
        totalDailyFreq,
        estimatedPurchaseAmt: dollars / totalDailyFreq
    };

}