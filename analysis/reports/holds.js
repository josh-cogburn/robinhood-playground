// pass in strategies
// return list of days

const detailedNonZero = require('../../app-actions/detailed-non-zero');
const getAssociatedStrategies = require('../../app-actions/get-associated-strategies');

const getTrend = require('../../utils/get-trend');

const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
const oneDec = roundTo(1);
const twoDec = roundTo(2);

module.exports = async (Robinhood) => {

    const nonzero = await detailedNonZero(Robinhood);
    console.log({ nonzero})
    const formatReturnDollars = returnDollars => returnDollars < 0 ? `-$${Math.abs(returnDollars)}` : `+$${returnDollars}`;
    const formatted = nonzero.map(pos => 
        [
            pos.symbol,
            `    currentReturn: ${formatReturnDollars(twoDec(pos.returnDollars))} (${pos.returnPerc}%) | total value: $${twoDec(pos.value)}`,
            `    buyPrice: ${pos.average_buy_price} | currentPrice: ${pos.lastTrade}`,
            `    buyStrategy: ${pos.buyStrategy} | buyDate: ${pos.buyDate}`
        ].join('\n')
    ).join('\n');
    
    console.log(formatted);
    return formatted;

};


