const sells = require('../analysis/reports/sells');
const holds = require('../analysis/reports/holds');
const sendEmail = require('../utils/send-email');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const DayReport = require('../models/DayReport');
const lookup = require('../utils/lookup');
const getTrend = require('../utils/get-trend');

// helpers
const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
const oneDec = roundTo(1);
const twoDec = roundTo(2);


module.exports = async Robinhood => {

    const todaysDate = (await getFilesSortedByDate('daily-transactions'))[0];

    // get account balance
    const [ account ] = (await Robinhood.accounts()).results;
    const portfolio = await Robinhood.url(account.portfolio);
    console.log({ portfolio });
    const { extended_hours_equity, adjusted_equity_previous_close } = portfolio;
    const absoluteChange = twoDec(extended_hours_equity - adjusted_equity_previous_close);
    const percChange = getTrend(extended_hours_equity, adjusted_equity_previous_close);
    console.log(`Account balance: ${extended_hours_equity}`);
    console.log(`Since previous close: $${absoluteChange} (${percChange}%)`);

    // get sp500 trend
    const { afterHoursPrice, prevClose } = await lookup(Robinhood, 'SPY');
    const spTrend = getTrend(afterHoursPrice, prevClose);
    console.log(`S&P500 trend: ${spTrend}%`);

    // analyze sells and holds
    const sellReport = await sells(Robinhood, 1);
    const holdReport = await holds(Robinhood);

    // prep data for mongo
    const mongoData = {
        accountBalance: twoDec(extended_hours_equity),
        actualBalanceTrend: {
            absolute: absoluteChange,
            percentage: percChange
        },
        holdReturn: {
            absolute: twoDec(holdReport.returnAbs),
            percentage: twoDec(holdReport.returnPerc)
        },
        sellReturn: {
            absolute: twoDec(sellReport.returnAbs),
            percentage: twoDec(sellReport.returnPerc)
        },
        sp500Trend: spTrend,
    };
    
    await sendEmail(
        `robinhood-playground: day-report for ${todaysDate}`,
        [
            JSON.stringify(mongoData, null, 2),
            '-----------------------------------',
            'CURRENT HOLDS',
            '-----------------------------------',
            holdReport.formatted,
            '',
            '-----------------------------------',
            'SELL REPORT',
            '-----------------------------------',
            sellReport.formatted,
        ].join('\n')
    );

    await DayReport.updateOne(
        { date: todaysDate },
        { $set: mongoData },
        { upsert: true }
    );

};