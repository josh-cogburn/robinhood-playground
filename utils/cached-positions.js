const cacheThis = require('./cache-this');
const getNonZero = require('../app-actions/detailed-non-zero');
const getAlpacaPositions = require('../alpaca/get-positions');

module.exports = cacheThis(
    async () => await getNonZero(),
    10// 10 min
);