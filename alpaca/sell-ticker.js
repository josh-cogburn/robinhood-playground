const { alpaca } = require('.');
const { force: { keep }} = require('../settings');

module.exports = async (_, ticker, dontSell) => {
    log({ ticker })
    const positions = await alpaca.getPositions();
    // log({ positions })
    const pos = positions.find(pos => pos.symbol === ticker);
    if (!pos) {
        return log('no position with that ticker: ', ticker);
    }
    log({ pos }, 'selling ticker');
    if (dontSell) return;
    const order = await alpaca.createOrder({
        symbol: pos.symbol, // any valid ticker symbol
        qty: Number(pos.qty),
        side: 'sell',
        type: 'market',
        time_in_force: 'day',
    });
    log(order)
};