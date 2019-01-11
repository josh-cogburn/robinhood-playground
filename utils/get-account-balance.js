const DayReport = require('../models/DayReport');
const getTrend = require('../utils/get-trend');

const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
const oneDec = roundTo(1);
const twoDec = roundTo(2);

module.exports = async (Robinhood, includeTrend, todaysDate) => {

    const [ account ] = (await Robinhood.accounts()).results;
    const portfolio = await Robinhood.url(account.portfolio);
    const { equity, extended_hours_equity } = portfolio;

    const accountBalance = extended_hours_equity || equity;

    console.log({ equity, accountBalance });
    let returnObj = { accountBalance };

    if (includeTrend) {
        const uniqDates = await DayReport.getUniqueDates();
        const todayIndex = uniqDates.findIndex(t => t === todaysDate);
        const prevDateIndex = todayIndex === -1 ? uniqDates.length - 1 : todayIndex - 1;
        const prevDate = uniqDates[prevDateIndex];
        console.log({ todayIndex, prevDateIndex, prevDate, uniqDates });
        const prevDay = await DayReport.findOne({ date: prevDate });
        console.log({ prevDay })
        const prevBalance = prevDay.accountBalance;
        console.log({ prevDay, prevBalance });
        // const prevDay = await DayReport.findOne({ date: uniqDates[] })
        const { adjusted_equity_previous_close } = portfolio;
        const useForYesterday = prevBalance || adjusted_equity_previous_close;
        const absoluteChange = twoDec(accountBalance - useForYesterday);
        const percChange = getTrend(accountBalance, useForYesterday);
        returnObj = {
            ...returnObj,
            accountBalanceTrend: {
                absolute: absoluteChange,
                percentage: percChange
            }
        };
    }

    return returnObj;

};