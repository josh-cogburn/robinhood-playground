const { alpaca } = require('.');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const shouldSellPosition = require('../utils/should-sell-position');


module.exports = async () => {

  const positions = (await alpaca.getPositions())
    .map(({ symbol, avg_entry_price, qty }) => ({
      ticker: symbol,
      average_buy_price: avg_entry_price,
      quantity: qty
    }));

    const withStSent = await mapLimit(positions, 3, async pos => ({
        ...pos,
        stSent: (await getStSentiment(pos.ticker) || {}).bullBearScore
    }));

    const withShouldSell = withStSent.map(pos => ({
        ...pos,
        shouldSell: shouldSellPosition(pos)
    }));

    return withShouldSell;

};