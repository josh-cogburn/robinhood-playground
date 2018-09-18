// pass in strategies
// return list of days

const detailedNonZero = require('../../app-actions/detailed-non-zero');
const getAssociatedStrategies = require('../../app-actions/get-associated-strategies');

const getTrend = require('../../utils/get-trend');

module.exports = async (Robinhood) => {

    const nonzero = await detailedNonZero(Robinhood);
    console.log(nonzero);

    const withTabulations = nonzero
        .map(pos => ({
            ...pos,
            returnPerc: getTrend(pos.afterHoursPrice || pos.lastTrade, pos.average_buy_price),
        }))
        .map(pos => ({
            ...pos,
            returnDollars: pos.returnPerc / 100 * Number(pos.quantity) * pos.lastTrade,
            value: pos.lastTrade * Number(pos.quantity),
            ticker: pos.symbol,
        }));

    const associatedBuys = await getAssociatedStrategies({
        tickers: withTabulations.map(t => t.symbol)
    });

    const combined = withTabulations.map(pos => {
        const relatedBuy = associatedBuys.find(obj => obj.ticker === pos.ticker);
        return {
            ...pos,
            ...(relatedBuy && {
                strategy: relatedBuy.strategy,
                buyPrice: relatedBuy.bid_price,
                buyDate: relatedBuy.date,
            }),
        };
    });

    const formatReturnDollars = returnDollars => returnDollars < 0 ? `-$${Math.abs(returnDollars)}` : `+$${returnDollars}`;
    const formatted = combined.map(pos => 
        [
            pos.symbol,
            `    currentReturn: ${formatReturnDollars(pos.returnDollars)} (${pos.returnPerc}%) | total value: $${pos.value}`,
            `    buyPrice: ${pos.average_buy_price} | currentPrice: ${pos.lastTrade}`,
            `    strategy: ${pos.strategy} | buyDate: ${pos.buyDate}`
        ].join('\n')
    ).join('\n');
    
    console.log(formatted);
    return formatted;

};


