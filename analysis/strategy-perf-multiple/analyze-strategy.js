const analyzeDay = require('./analyze-day');
const playouts = require('./playouts');

const {
    avgArray,
    percUp,
    hundredResult
} = require('../../utils/array-math');

const keyOrder = ['next-day-9', 'next-day-85', 'next-day-230', 'next-day-330', 'second-day-9', 'third-day-9', 'fourth-day-9'];

const runPlayout = (playoutObj, breakdowns) => {

    const { type, fn: playoutFn } = playoutObj;

    const outcomes = breakdowns.map(playoutFn);
    // console.log(outcomes, 'out');
    const onlyValues = outcomes
        .map(o => o.value)
        .filter(v => Math.abs(v) < 50);
    const onlyHits = outcomes.filter(o => o.hitFn);
    return {
        percUp: percUp(onlyValues),
        avgTrend: avgArray(onlyValues),
        hundredResult: hundredResult(onlyValues),
        ...(type === 'individualFn' && {
            percHitPlayout: onlyHits.length / outcomes.length,
            percHitsPositive: onlyHits.filter(o => o.value > 0).length / onlyHits.length,
        }),
        // onlyValues: onlyValues.join(', ')
    };
};

const analyzeStrategy = ({
    strategyName,
    stratObj,
    detailed = false
}) => {

    const analyzed = Object.keys(stratObj)
        .map(date => analyzeDay({
            strategyName,
            stratPerf: stratObj[date],
            date
        }))
        .filter(value => !!value);

    const withErrors = analyzed
        .filter(value => value.notEnoughError);

    // console.log('num errors', withErrors.length);

    const withoutErrors = analyzed
        .filter(value => !value.notEnoughError);
    //
    const daysDown = withoutErrors
        .filter(v => !v.didGoUp)
        // .map(v => v.date);

    const breakdownsByDay = withoutErrors.map(obj => {
        const breakdowns = keyOrder
            .map(k => obj.breakdowns[k])
            .filter(val => !!val);
        // console.log(obj.date, obj.picks, ':', breakdowns);
        return breakdowns;
    });

    // console.log(breakdownsByDay, 'breakdownsByDay')

    return {
        strategy: strategyName,
        percUp: withoutErrors.filter(a => a.didGoUp).length / withoutErrors.length,
        // avgMax: avgArray(
        //     withoutErrors
        //         .map(a => a.maxUp)
        //         .filter(trend => Math.abs(trend) < 50)
        // ),
        // numErrors: withErrors.length,
        count: withoutErrors.length,

        ...(detailed ? (() => {

            // console.log(breakdownsByDay, 'breakdownsByDay');

            const breakdownRoundup = withoutErrors.reduce((acc, obj) => {
                const { breakdowns } = obj;
                Object.keys(breakdowns).forEach(key => {
                    acc[key] = (acc[key] || []).concat(breakdowns[key]);
                });
                return acc;
            }, {});

            // console.log('breakdownround', breakdownRoundup);

            const breakdownStats = {};

            keyOrder.forEach(key => {
                if (!breakdownRoundup[key]) return;
                const filteredVals = breakdownRoundup[key].filter(t => Math.abs(t) < 50);
                breakdownStats[key] = {
                    avg: avgArray(filteredVals),
                    percUp: percUp(filteredVals)
                }
            });

            return {
                daysDown: daysDown,
                bigDays: withoutErrors.filter(v => v.maxUp > 50),
                breakdowns: breakdownStats,
                maxs: withoutErrors.map(a => a.maxUp),
                hundredResult: hundredResult(withoutErrors.map(obj => obj.maxUp))
            };

        })() : {
            daysDown: daysDown.length,
        }),

        playouts: Object.keys(playouts).reduce((acc, k) => ({
            ...acc,
            [k]: runPlayout(playouts[k], breakdownsByDay)
        }), {}),



        // dates: withoutErrors.map(a => a.date)
    };

};

module.exports = analyzeStrategy;
