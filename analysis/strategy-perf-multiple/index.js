
const initStratPerfs = require('./init-strat-perfs');
const calcUniqStrategies = require('./calc-uniq-strategies');
const analyzeStrategy = require('./analyze-strategy');
const { analyzeRoundup } = require('./generate-breakdowns');
const { isBreakdownKey } = require('./breakdown-key-compares');
const saveToJson = require('./save-to-json');

module.exports = async (Robinhood, daysBack = 2, ...strategies) => {
    console.log('days back', daysBack);

    let maxBreakdownKey = (() => {
        if (strategies.length && isBreakdownKey(strategies[0])) {
            // optional argument
            // for exampple: node run analysis/strategy-perf-multiple 52 next-day-330 list-of-strategies... 2... etc...
            const breakdownArg = strategies.shift();
            console.log('max breakdown key set to...', breakdownArg);
            return breakdownArg;
        }
    })();

    const suppliedStrategies = !!strategies.length;
    console.log(
        'supplied strategies: ',
        suppliedStrategies ? strategies : suppliedStrategies
    );

    const { days, stratObj } = await initStratPerfs(daysBack);
    let allStrategies = strategies.length ? strategies : calcUniqStrategies(stratObj);
    // const allStrategies = [ // debug
    //     'constant-risers-5minute-percUpHighClosePoints-lowovernightjumps-100',
    //     'based-on-jump-down3overnight-trending35257-notWatchout-first1-fiveTo10-30',
    //     'low-float-high-volume-volToAvgPoints-trend5to10-6'
    // ];
    console.log('num strategies', allStrategies.length);

    const allRoundup = allStrategies.map((strategyName, index) => {
        const strategyAnalysis = analyzeStrategy({
            strategyName,
            stratObj,
            detailed: suppliedStrategies,
            maxBreakdownKey
        });
        if (index % 50 === 0) {
            console.log(index, '/', allStrategies.length);
        }
        return strategyAnalysis;
    });

    console.log('done analyzing strategies')

    if (suppliedStrategies) {
        return allRoundup;
    }

    // if !suppliedStrategies
    const analyzed = analyzeRoundup(allRoundup);
    if (daysBack > 50) {
        await saveToJson(analyzed);
    }
    return analyzed;

};
