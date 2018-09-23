// utils
const getTrend = require('../utils/get-trend');
const chunkApi = require('../utils/chunk-api');


module.exports = async (Robinhood, trend) => {

    console.log('adding fundamentals')
    let fundamentals = await chunkApi(
        trend.map(t => t.ticker),
        async tickerStr => {
            // console.log('tickerstr', tickerStr);
            const { results } = await Robinhood.url(`https://api.robinhood.com/fundamentals/?symbols=${tickerStr}`);
            return results;
        },
        10
    );

    let withFundamentals = trend.map((obj, i) => {
        let funds = fundamentals[i] || {};
        return {
            ...obj,
            fundamentals: funds
        };
    });

    return withFundamentals;

};
