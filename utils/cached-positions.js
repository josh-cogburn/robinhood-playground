const cacheThis = require('./cache-this');
const getNonZero = require('../app-actions/detailed-non-zero');

module.exports = cacheThis(
    getNonZero,
    1000 * 60 * 10// 10 min
);