const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const { uniqifyArrayOfStrategies } = require('../utils/uniqify-stuff');
const strategyPerfMultiple = require('../analysis/strategy-perf-multiple');

module.exports = async (Robinhood, daysBack) => {

    let spm;

    console.log('SPM SPM SPM', {daysBack});

    if (!daysBack) {
        console.log('from strat-perf-multiples')
        const files = await getFilesSortedByDate('strat-perf-multiples');
        console.log(files);
        if (!files.length) {
            return {};
        }
        spm = require(`../json/strat-perf-multiples/${files[0]}`);
        console.log(Object.keys(spm));
    } else {
        console.log({ daysBack });
        spm = await strategyPerfMultiple(Robinhood, daysBack);

    }
    

    return Object.keys(spm).reduce((acc, key) => {
        // console.log('key', key)
        return {
            ...acc,
            [key]: spm[key].map(list => list.strategy),
            [`${key}-slice16`]: spm[key].slice(0, 16).map(list => list.strategy),
            [`${key}-slice16-uniq`]: uniqifyArrayOfStrategies(spm[key].slice(0, 16)).map(list => list.strategy),
        };
    }, {});
}