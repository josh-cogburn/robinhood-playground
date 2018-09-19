// utils
const getTrend = require('../utils/get-trend');
const chunkApi = require('../utils/chunk-api');


module.exports = async (Robinhood, trend) => {

    console.log('adding overnight jump')
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

    // console.log('with fundame', withFundamentals);

    return withFundamentals.map(stock => ({
        ...stock,
        overnightJump: Number(stock.fundamentals.open)
            ? getTrend(stock.fundamentals.open, stock.quote_data.adjusted_previous_close)
            : getTrend(stock.last_trade_price, stock.quote_data.adjusted_previous_close)
    })).filter(a => a.fundamentals.open).sort((a, b) => b.overnightJump - a.overnightJump);

};
