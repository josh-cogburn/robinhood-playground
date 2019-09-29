

const { alpaca } = require('.');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const lookup = require('../utils/lookup');

const ATTEMPT_TIMEOUTS = [3, 5, 7, 9];     // seconds
const ATTEMPT_PERCS_ABOVE = [1, 3, 5, 7];  // percents
const MAX_ATTEMPTS = ATTEMPT_TIMEOUTS.length;

const attemptBuy = async ({
    ticker, 
    quantity, 
    pickPrice,
    attemptNum
}) => {

    const attemptTimeout = ATTEMPT_TIMEOUTS[attemptNum];
    const attemptPercAbove = ATTEMPT_PERCS_ABOVE[attemptNum];

    const { askPrice } = await lookup(ticker);
    const attemptPrice = Math.min(askPrice, pickPrice) * (1 + attemptPercAbove / 100);
    log({
        askPrice,
        pickPrice,
        attemptPrice
    })
    // queue alpaca limit order 4% above pickPrice

    log('ALPACA LIMIT BUY');
    str({ ticker, quantity, attemptPrice });
    const min = getMinutesFrom630();
    const extendedHours = min < 0 || min > 390;
    const data = {
        symbol: ticker, // any valid ticker symbol
        qty: Number(quantity),
        side: 'buy',
        type: 'limit',
        limit_price: Number(attemptPrice),
        ...extendedHours ? {
            extended_hours: true,
            time_in_force: 'day',
        } : {
            time_in_force: 'day'
        }
        
    };
    log('data buy alpaca', data)
    let order;
    try {
        order = await alpaca.createOrder(data);
    } catch (e) {
        console.log('error')
    }

    log(order);
    await new Promise(resolve => setTimeout(resolve, 1000 * attemptTimeout));

    if (!order) {
        console.log('returning fake')
        return {
            id: '19d3b568-31c3-41ba-8c27-0d80f8dc4c64',
            client_order_id: 'f707b83b-bf47-47a0-906e-0026841b86fd',
            created_at: '2019-09-27T19:10:14.9355Z',
            updated_at: '2019-09-27T19:10:15.030731Z',
            submitted_at: '2019-09-27T19:10:14.906353Z',
            filled_at: '2019-09-27T19:10:15.024474Z',
            expired_at: null,
            canceled_at: null,
            failed_at: null,
            replaced_at: null,
            replaced_by: null,
            replaces: null,
            asset_id: '3e59f0bd-a197-4e69-995a-733be53ecb0f',
            symbol: 'HSGX',
            asset_class: 'us_equity',
            qty: '1',
            filled_qty: '1',
            filled_avg_price: '0.1589',
            order_type: 'limit',
            type: 'limit',
            side: 'buy',
            time_in_force: 'day',
            limit_price: '0.1668',
            stop_price: null,
            status: 'filled',
            extended_hours: false
        };
    }
    const thatOrder = await alpaca.getOrder(order.id);
    return thatOrder;

};

module.exports = async ({ ticker, quantity, pickPrice, strategy }) => {

    for (let attemptNum of Array(MAX_ATTEMPTS).fill(0).map((v, i) => i)) {
        strlog({ attemptNum })
        const attemptResponse = await attemptBuy({
            ticker, quantity, pickPrice, attemptNum
        });
        if (attemptResponse.filled_at) {
            return attemptResponse;
        } else {
            await alpaca.cancelOrder(thatOrder.id);
        }
    }

    return response;

};