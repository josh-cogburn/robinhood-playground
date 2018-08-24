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
    return allStratsPerf;
};
