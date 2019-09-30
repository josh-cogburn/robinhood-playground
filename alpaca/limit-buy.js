

const { alpaca } = require('.');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const lookup = require('../utils/lookup');
const marketBuy = require('./market-buy');

const ATTEMPT_TIMEOUTS = [5, 5, 5, 6, 6, 7, 8, 9, 10, 11];     // seconds
const ATTEMPT_PERCS_ABOVE = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180];  // percents
const MAX_ATTEMPTS = ATTEMPT_TIMEOUTS.length;


const calcLimitPrice = async ({ ticker, pickPrice, attemptNum }) => {
    const attemptPercAbove = ATTEMPT_PERCS_ABOVE[attemptNum];

    const { bidPrice, askPrice, lastTrade } = await lookup(ticker);
    const lowVal = Math.min(bidPrice, askPrice, lastTrade);
    const highVal = Math.max(bidPrice, askPrice, lastTrade );
    const spread = Math.max(highVal - lowVal, 0.02 * lastTrade);
    
    const aboveLow = spread * attemptPercAbove / 100;
    const maxPrice = Math.min(askPrice, pickPrice) * 1.07;
    const finalPrice = Math.min(lowVal + aboveLow, maxPrice);
    strlog({
        bidPrice,
        askPrice,
        spread,
        attemptPercAbove,
        aboveLow,
        maxPrice,
        finalPrice
    })
    return finalPrice;
};


const attemptBuy = async ({
    ticker, 
    quantity, 
    attemptPrice,
    // attemptNum
}) => {

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
        strlog({ e })
    }
    return order;
};

module.exports = async ({ ticker, quantity, pickPrice, strategy }) => {

    // limit
    for (let attemptNum of Array(MAX_ATTEMPTS).fill(0).map((v, i) => i)) {
        strlog({ attemptNum })
        const attemptPrice = await calcLimitPrice({ ticker, pickPrice, attemptNum });
        let attemptResponse = await attemptBuy({
            ticker, quantity, attemptPrice, attemptNum
        });
        const attemptTimeout = ATTEMPT_TIMEOUTS[attemptNum];
        await new Promise(resolve => setTimeout(resolve, 1000 * attemptTimeout));
        attemptResponse = attemptResponse ? await alpaca.getOrder(attemptResponse.id) : {};
        if (attemptResponse.filled_at) {
            return {
                alpacaOrder: attemptResponse,
                attemptNum
            };
        } else if (attemptResponse.id) {
            await alpaca.cancelOrder(attemptResponse.id);
        }
    }


    console.log('unable to limit buy, falling back to market buy', ticker);
    return marketBuy({ ticker, quantity });

};