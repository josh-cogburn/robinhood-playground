const getStSent = require('../utils/get-stocktwits-sentiment');
const lookup = require('../utils/lookup');
const getTrend = require('../utils/get-trend');
module.exports = async (
    Robinhood, 
    ticker, 
    avgBuyPrice,
    bullishLimits = [10, -6],
    bearishLimits = [7, -3]
) => {
    ticker = ticker.toUpperCase();
    pricePaid = Number(avgBuyPrice);

    log(ticker, pricePaid )

    const [stSent, l] = await Promise.all([
        getStSent(null, ticker),
        lookup(Robinhood, ticker)
    ]);
    const trend = getTrend(l.currentPrice, avgBuyPrice);

    // log({ l, trend });

    const stSentBullish = (stSent || {}).bullBearScore > 50;
    str({ stSentBullish, stSent })
    const [upper, lower] = stSentBullish ? bullishLimits : bearishLimits;
    return trend > upper || trend < lower;
}