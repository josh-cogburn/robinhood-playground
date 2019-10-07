
// const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const { alpaca } = require('.');
const marketSell = require('./market-sell');


const limitSell = async ({
    ticker = 'VRML', 
    quantity = 574, 
    limitPrice = 0.4273,
    timeoutSeconds = 15,
    fallbackToMarket = true
    // limitNum
}= {}) => {

    log('ALPACA LIMIT SELL');
    str({ ticker, quantity, limitPrice });
    // const min = getMinutesFrom630();
    // const extendedHours = min < 0 || min > 390;
    const data = {
        symbol: ticker, // any valid ticker symbol
        qty: Number(quantity),
        side: 'sell',
        type: 'limit',
        limit_price: Number(limitPrice),
        // ...extendedHours ? {
            extended_hours: true,
            time_in_force: 'day',
        // } : {
        //     time_in_force: 'day'
        // }
    };
    log('data sell alpaca', data)
    let order;
    try {
        order = await alpaca.createOrder(data);
    } catch (e) {
        strlog({ e })
    }

    await new Promise(resolve => setTimeout(resolve, 1000 * timeoutSeconds));
    order = order ? await alpaca.getOrder(order.id) : {};

    if (!order.filled_at) {
        await alpaca.cancelOrder(order.id);
        order = fallbackToMarket ? await marketSell({ ticker, quantity }) : order;
    }

    return order;

};

module.exports = limitSell;