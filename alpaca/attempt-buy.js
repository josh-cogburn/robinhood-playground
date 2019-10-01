
const lookup = require('../utils/lookup');
const limitBuy = require('./limit-buy');
const marketBuy = require('./market-buy');

const ATTEMPT_TIMEOUTS = [5, 6, 7, 8];     // seconds
const ATTEMPT_PERCS = [-1, 0.5, 3.5, 5.5];  // percents
const MAX_ATTEMPTS = ATTEMPT_TIMEOUTS.length;



const calcLimitPrice = async ({ ticker, pickPrice, attemptNum }) => {
    const attemptPercAbove = ATTEMPT_PERCS[attemptNum];

    const { bidPrice, askPrice, lastTrade } = await lookup(ticker);
    // const lowVal = Math.min(bidPrice, askPrice, lastTrade);
    const highVal = Math.max(bidPrice, askPrice, lastTrade);
    
    const aboveHigh = highVal * attemptPercAbove / 100;
    const maxPrice = pickPrice * 1.07;
    const finalPrice = Math.min(highVal + aboveHigh, maxPrice);
    strlog({
        bidPrice,
        askPrice,
        lastTrade,

        highVal,
        aboveHigh,

        attemptNum,
        attemptPercAbove,
        maxPrice,
        finalPrice
    })
    return finalPrice;
};

module.exports = async ({ ticker, quantity, pickPrice, strategy }) => {

    // limit
    for (let attemptNum of Array(MAX_ATTEMPTS).fill(0).map((v, i) => i)) {
        strlog({ attemptNum })
        const attemptPrice = await calcLimitPrice({ ticker, pickPrice, attemptNum });
        let attemptResponse = await limitBuy({
            ticker, 
            limitPrice: attemptPrice,
            quantity,
            timeoutSeconds: ATTEMPT_TIMEOUTS[attemptNum],
            fallbackToMarket: false
        }) || {};
        if (attemptResponse.filled_at) {
            return {
                alpacaOrder: attemptResponse,
                attemptNum
            };
        }
    }


    console.log('unable to limit buy, falling back to market buy', ticker);
    return {
        alpacaOrder: await marketBuy({ ticker, quantity }),
        attemptNum: 'market'
    };

};