const cacheThis = require('./cache-this');
const getNonZero = require('../app-actions/detailed-non-zero');
const getAlpacaPositions = require('../alpaca/get-positions');

module.exports = cacheThis(
    async () => ({
        robinhood: await getNonZero(),
        alpaca: await getAlpacaPositions()
    }),
    10// 10 min
);