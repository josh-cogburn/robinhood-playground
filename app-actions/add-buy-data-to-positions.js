const getAssociatedStrategies = require('./get-associated-strategies');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const getTrend = require('../utils/get-trend');


// utils
const daysBetween = (firstDate, secondDate) => {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    return diffDays;
};

const addBuyDateToPositions = async nonzero => {
    console.log('adding buy to positions', nonzero)
    // shared var
    const dailyTransactionDates = await getFilesSortedByDate('daily-transactions');
    
    // calc totalValue & return in percentage and absolutely $ amt
    const withReturn = nonzero
        .map(pos => ({
            ...pos,
            symbol: pos.ticker,
            returnPerc: getTrend(pos.afterHoursPrice || pos.lastTrade, pos.average_buy_price),
        }))
        .map(pos => ({
            ...pos,
            returnDollars: pos.returnPerc / 100 * pos.quantity * pos.lastTrade,
            value: pos.lastTrade * pos.quantity,
        }));

    // include buyStrategy, buyDate (from daily-transactions)
    const associatedBuys = await getAssociatedStrategies({
        tickers: withReturn.map(pos => pos.ticker),
    }, dailyTransactionDates);

    console.log({associatedBuys})

    const withBuys = withReturn.map(pos => {
        const relatedBuy = associatedBuys.find(obj => obj.ticker === pos.ticker);
        console.log({ associatedBuys, relatedBuy, ticker: pos.ticker })
        return {
            ...pos,
            ...(relatedBuy && {
                buyStrategy: relatedBuy.strategy,
                buyPrice: relatedBuy.bid_price,
                buyDate: relatedBuy.date,
            }),
        };
    });

    console.log({ withBuys})
    
    
        
    // calc dayAge
    const pmModelDates = await getFilesSortedByDate('prediction-models');
    const calcDayAgeFromPosition = pos => {
        const { buyDate: date, updated_at } = pos;
        if (date) {
            const getIndexFromDateList = dateList => dateList.findIndex(d => d === date);
            const pmIndex = getIndexFromDateList(pmModelDates);
            return pmIndex !== -1 ? pmIndex : getIndexFromDateList(dailyTransactionDates);
        } else {
            return daysBetween(new Date(), new Date(updated_at));
        }
    };

    // withBuys + dayAge =

    let withAge = withBuys.map(pos => ({
        ...pos,
        dayAge: calcDayAgeFromPosition(pos)
    }));

    return withAge;
};

module.exports = addBuyDateToPositions;