
const initStratPerfs = require('./init-strat-perfs');
const calcUniqStrategies = require('./calc-uniq-strategies');
const analyzeStrategy = require('./analyze-strategy');
const { analyzeRoundup } = require('./generate-breakdowns');
const { isBreakdownKey } = require('./breakdown-key-compares');
const saveToJson = require('./save-to-json');

module.exports = async (Robinhood, daysBack = 2, ...strategiesArgs) => {
    console.log('days back', daysBack);

    let maxBreakdownKey = (() => {
        if (strategiesArgs.length && isBreakdownKey(strategiesArgs[0])) {
            // optional argument
            // for exampple: node run analysis/strategy-perf-multiple 52 next-day-330 list-of-strategies... 2... etc...
            const breakdownArg = strategiesArgs.shift();
            console.log('max breakdown key set to...', breakdownArg);
            return breakdownArg;
        }
    })();



    const { days, stratObj } = await initStratPerfs(daysBack);
    let allStrategies = calcUniqStrategies(stratObj);

    const suppliedStrategies = strategiesArgs.length;
    const strategiesOfInterest = suppliedStrategies
        ? allStrategies.filter(strat =>
                strategiesArgs.includes(strat)
                || strategiesArgs.every(s => strat.includes(s))
        ) : allStrategies;
    const isSearch = strategiesArgs[0] && !allStrategies.includes(strategiesArgs[0]);

    // const allStrategies = [ // debug
    //     'constant-risers-5minute-percUpHighClosePoints-lowovernightjumps-100',
    //     'based-on-jump-down3overnight-trending35257-notWatchout-first1-fiveTo10-30',
    //     'low-float-high-volume-volToAvgPoints-trend5to10-6'
    // ];
    if (suppliedStrategies) {
        console.log('strategies of interest', strategiesOfInterest);
        console.log('isSearch', isSearch);
        // console.log('strategiesArgs[0]', strategiesArgs[0])
        // console.log(allStrategies, 'allStrategies')
    }
    console.log('num strategies', strategiesOfInterest.length);

    const allRoundup = strategiesOfInterest.map((strategyName, index) => {
        const strategyAnalysis = analyzeStrategy({
            strategyName,
            stratObj,
            detailed: suppliedStrategies && !isSearch,
            maxBreakdownKey
        });
        if (index % 50 === 0) {
            console.log(index, '/', strategiesOfInterest.length);
        }
        return strategyAnalysis;
    });

    console.log('done analyzing strategies')

    if (suppliedStrategies && false) {
        return allRoundup;
    }

    // if !suppliedStrategies
    const analyzed = analyzeRoundup(allRoundup);
    if (daysBack > 50 && !suppliedStrategies) {
        await saveToJson(analyzed);
    }
    return analyzed;

};
