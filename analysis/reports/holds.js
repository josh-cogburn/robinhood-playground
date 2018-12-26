// pass in strategies
// return list of days

const mapLimit = require('promise-map-limit');
const detailedNonZero = require('../../app-actions/detailed-non-zero');
const getAssociatedStrategies = require('../../app-actions/get-associated-strategies');

const getTrend = require('../../utils/get-trend');

const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
const oneDec = roundTo(1);
const twoDec = roundTo(2);

module.exports = async (Robinhood) => {

    const nonzero = await detailedNonZero(Robinhood);
    const positions = nonzero.sort((a, b) => Math.abs(b.returnDollars) - Math.abs(a.returnDollars))
    const formatReturnDollars = returnDollars => returnDollars < 0 ? `-$${Math.abs(returnDollars)}` : `+$${returnDollars}`;
    const totalValue = positions.reduce((acc, { value }) => acc + value, 0);
    const returnAbs = positions.reduce((acc, { returnDollars }) => acc + returnDollars, 0);
    const returnPerc = returnAbs * 100 / totalValue;

    // const withBuyPrices = 
    console.log({ positions });
        
    const lines = [
        `Total return: $${twoDec(returnAbs)} (${twoDec(returnPerc)}%)`,
        `Total value: $${twoDec(totalValue)}`,
        '-----------------------------------',
        ...positions.map(pos => 
            [
                pos.symbol,
                `    currentReturn: ${formatReturnDollars(twoDec(pos.returnDollars))} (${pos.returnPerc}%) | total value: $${twoDec(pos.value)}`,
                `    buyPrice: $${pos.average_buy_price} | currentPrice: $${pos.lastTrade}`,
                `    buyStrategy: ${pos.buyStrategy} | buyDate: ${pos.buyDate}`
            ].join('\n')
        )
    ];

    const formatted = lines.join('\n');
    
    return {
        formatted,
        positions,
        returnAbs,
        returnPerc
    };

};


