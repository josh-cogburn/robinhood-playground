const getStSent = require('../utils/get-stocktwits-sentiment');
const lookup = require('../utils/lookup');
const getTrend = require('../utils/get-trend');
module.exports = async (
    Robinhood, 
    ticker, 
    avgBuyPrice,
    bullishLimits = [14, -20],
    bearishLimits = [7, -10]
) => {
    ticker = ticker.toUpperCase();
    pricePaid = Number(avgBuyPrice);

    const [stSent, l] = await Promise.all([
        getStSent(null, ticker),
        lookup(Robinhood, ticker)
    ]);
    const trend = getTrend(l.currentPrice, avgBuyPrice);

    // log({ l, trend });

    const [upper, lower] = stSent.bullBearScore > 50 ? bullishLimits : bearishLimits;
    return trend > upper || trend < lower;
}