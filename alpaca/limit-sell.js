

const { alpaca } = require('.');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const lookup = require('../utils/lookup');
const marketSell = require('./market-sell');

const ATTEMPT_TIMEOUTS = [5, 6, 7, 8];     // seconds
const ATTEMPT_PERCS = [-1, 0.5, 3, 5];  // percents
const MAX_ATTEMPTS = ATTEMPT_TIMEOUTS.length;


const calcLimitPrice = async ({ ticker, attemptNum, maxPrice = Number.POSITIVE_INFINITY }) => {
    const attemptPercAbove = ATTEMPT_PERCS[attemptNum];

    const { bidPrice, askPrice, lastTrade } = await lookup(ticker);
    const lowVal = Math.min(bidPrice, askPrice, lastTrade);
    // const highVal = Math.max(bidPrice, askPrice, lastTrade);
    // const spread = Math.max(highVal - lowVal, 0.02 * lastTrade);
    maxPrice = Math.min(lastTrade * 1.07, maxPrice);
    const aboveLow = lowVal * attemptPercAbove / 100;
    const finalPrice = Math.min(lowVal + aboveLow, maxPrice);
    strlog({
        bidPrice,
        askPrice,
        lastTrade,

        lowVal,
        attemptPercAbove,
        aboveLow,
        maxPrice,
        finalPrice
    })
    return finalPrice;
};


const attemptSell = async ({
    ticker, 
    quantity, 
    attemptPrice,
    // attemptNum
}) => {

    log('ALPACA LIMIT SELL');
    str({ ticker, quantity, attemptPrice });
    const min = getMinutesFrom630();
    const extendedHours = min < 0 || min > 390;
    const data = {
        symbol: ticker, // any valid ticker symbol
        qty: Number(quantity),
        side: 'sell',
        type: 'limit',
        limit_price: Number(attemptPrice),
        ...extendedHours ? {
            extended_hours: true,
            time_in_force: 'day',
        } : {
            time_in_force: 'day'
        }
    };
    log('data sell alpaca', data)
    let order;
    try {
        order = await alpaca.createOrder(data);
    } catch (e) {
        strlog({ e })
    }
    return order;
};

module.exports = async ({ ticker, quantity }) => {

    // limit
    for (let attemptNum of Array(MAX_ATTEMPTS).fill(0).map((v, i) => i)) {
        strlog({ attemptNum })
        const attemptPrice = await calcLimitPrice({ ticker, attemptNum });
        let attemptResponse = await attemptSell({
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


    console.log('unable to limit sell, falling back to market sell', ticker);
    return marketSell({ ticker, quantity });

};