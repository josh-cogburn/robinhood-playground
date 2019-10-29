

const { alpaca } = require('.');
const lookup = require('../utils/lookup');
const limitSell = require('./limit-sell');
const marketSell = require('./market-sell');

const ATTEMPT_TIMEOUTS = [360, 1360, 60 * 20, 60 * 7];     // seconds
const ATTEMPT_PERCS = [-0.5, -0.25, 0.1, 1.5];  // percents
const MAX_ATTEMPTS = ATTEMPT_TIMEOUTS.length;


const calcLimitPrice = async ({ ticker, attemptNum, minPrice = Number.NEGATIVE_INFINITY }) => {
    const attemptPercBelow = ATTEMPT_PERCS[attemptNum];

    const { bidPrice, askPrice, lastTrade } = await lookup(ticker);
    // const lowVal = Math.min(bidPrice, askPrice, lastTrade);
    const highVal = lastTrade // Math.max(bidPrice, askPrice, lastTrade);
    // const spread = Math.max(highVal - lowVal, 0.02 * lastTrade);
    minPrice = Math.min(lastTrade * 1.07, minPrice);
    const belowHigh = highVal * attemptPercBelow / 100;
    const finalPrice = Math.max(highVal - belowHigh, minPrice);
    strlog({
        bidPrice,
        askPrice,
        lastTrade,

        highVal,
        attemptPercBelow,
        belowHigh,
        minPrice,
        finalPrice
    });
    return finalPrice;
};


module.exports = async ({ ticker, quantity, fallbackToMarket }) => {

    // limit
    for (let attemptNum of Array(MAX_ATTEMPTS).fill(0).map((v, i) => i)) {
        strlog({ attemptNum })
        const attemptPrice = await calcLimitPrice({ ticker, attemptNum });
        let attemptResponse = await limitSell({
            ticker, 
            limitPrice: attemptPrice,
            quantity, 
            timeoutSeconds: ATTEMPT_TIMEOUTS[attemptNum],
            fallbackToMarket: false,
        }) || {};
        if (attemptResponse.filled_at) {
            return {
                alpacaOrder: attemptResponse,
                attemptNum
            };
        } else if (attemptResponse.id) {
            await alpaca.cancelOrder(attemptResponse.id);
        }
    }

    if (!fallbackToMarket) return;

    console.log('unable to limit sell, falling back to market sell', ticker);
    return {
        alpacaOrder: await marketSell({ ticker, quantity }),
        attemptNum: 'market'
    };

};