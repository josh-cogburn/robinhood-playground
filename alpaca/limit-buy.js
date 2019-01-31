

const { alpaca } = require('.');

module.exports = async (ticker, quantity, price) => {
    log('ALPACA LIMIT BUY');
    str({ ticker, quantity, price });
    const order = await alpaca.createOrder({
        symbol: ticker, // any valid ticker symbol
        qty: quantity,
        side: 'buy',
        type: 'limit',
        limit_price: price,
        time_in_force: 'day',
    });
    log(order);
};