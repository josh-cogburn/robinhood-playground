const manualPms = require('../pms/manual');
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const jsonMgr = require('../utils/json-mgr');
const stratPerfMultiple = require('./strategy-perf-multiple');

module.exports = async (Robinhood, daysBack, ...pmNames) => {
    const pmStrats = flatten(
        pmNames.map(pm => manualPms[pm])
    );
    const stratPerf = await stratPerfMultiple(Robinhood, daysBack, ...pmStrats);
    // console.log(stratPerf);

    const allStratsPerf = pmStrats
        .map(strat => {
            return stratPerf.find(perf => perf.strategy === strat);
        })
        .filter(obj => !!obj)
        .map(obj => {
            ['allDays', 'breakdowns', 'bigDays', 'playouts'].forEach(key => {
                delete obj[key];
            });
            return obj;
        });

    const limits = {
        upperCounts: ({ count }) => count > daysBack * 2 / 3,
        middleCounts: ({ count }) => count >= daysBack * 1 / 3 && count <= daysBack * 2 / 3,
        lowCounts: ({ count }) => count < daysBack * 1 / 3 && count >= 2,
        realLowCounts: ({ count }) => count < 2
    };


    const objRoundup = Object.keys(limits).reduce((acc, key) => ({
        [key]: allStratsPerf.filter(limits[key]),
        ...acc
    }), {
        missing: pmStrats.filter(strat =>
            !allStratsPerf
                .map(o => o.strategy)
                .includes(strat)
        ).map(strategy => ({ strategy }))
    });

    Object.keys(objRoundup).forEach(key => {
        console.log(key);
        console.log('----------');
        console.log(JSON.stringify(objRoundup[key].map(o => o.strategy), null, 2));
    });


    // return allStratsPerf;
};
