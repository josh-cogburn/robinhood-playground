const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const { uniqifyArrayOfStrategies } = require('../utils/uniqify-stuff');
module.exports = async (Robinhood) => {
    const files = await getFilesSortedByDate('strat-perf-multiples');
    console.log(files);
    const spm = require(`../json/strat-perf-multiples/${files[0]}`);
    console.log(Object.keys(spm));

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