

const { alpaca } = require('.');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');

module.exports = async (_, ticker, quantity, price) => {

    const min =getMinutesFrom630();
    const extendedHours = min < 0 || min > 390;

    log('ALPACA LIMIT BUY');
    str({ ticker, quantity, price });
    const data = {
        symbol: ticker, // any valid ticker symbol
        qty: Number(quantity),
        side: 'buy',
        type: 'limit',
        limit_price: Number(price),
        ...extendedHours ? {
            extended_hours: true,
            time_in_force: 'day',
        } : {
            // time_in_force: 'fok'
        }
        
    };
    log('data buy alpaca', data)
    const order = await alpaca.createOrder(data);

    log(order);
    await new Promise(resolve => setTimeout(resolve, 1000 * 60 * 120));  // 2hr
    
    const thatOrder = await alpaca.getOrder(order.id);
    log(
        'that last order',
        thatOrder
    )
    if (!thatOrder.filledAt) {
        console.log('would have canceled')
        log(
            'canceling purchase',
            ticker,
            alpaca.cancelOrder(thatOrder.id)
        )
    }
};