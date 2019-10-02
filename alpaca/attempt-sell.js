

const { alpaca } = require('.');
const lookup = require('../utils/lookup');
const limitSell = require('./limit-sell');
const marketSell = require('./market-sell');

const ATTEMPT_TIMEOUTS = [15, 15, 25, 30];     // seconds
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


module.exports = async ({ ticker, quantity }) => {

    // limit
    for (let attemptNum of Array(MAX_ATTEMPTS).fill(0).map((v, i) => i)) {
        strlog({ attemptNum })
        const attemptPrice = await calcLimitPrice({ ticker, attemptNum });
        let attemptResponse = await limitSell({
            ticker, 
            quantity, 
            limitPrice: attemptPrice,
            fallbackToMarket: false,
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