

const { alpaca } = require('.');

module.exports = async (_, ticker, quantity, price) => {
    log('ALPACA LIMIT BUY');
    str({ ticker, quantity, price });
    const data = {
        symbol: ticker, // any valid ticker symbol
        qty: Number(quantity),
        side: 'buy',
        type: 'limit',
        limit_price: Number(price),
        time_in_force: 'day',
    };
    log('data buy alpaca', data)
    const order = await alpaca.createOrder(data);

    log(order);
    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 30));  // 30 min
    
    const thatOrder = await alpaca.getOrder(order.id);
    log(
        'that last order',
        thatOrder
    )
    if (!thatOrder.filledAt) {
        log(
            'canceling purchase',
            ticker,
            alpaca.cancelOrder(thatOrder.id)
        )
    }
};