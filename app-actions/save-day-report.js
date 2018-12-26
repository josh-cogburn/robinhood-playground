const sells = require('../analysis/reports/sells');
const holds = require('../analysis/reports/holds');
const sendEmail = require('../utils/send-email');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const DayReport = require('../models/DayReport');
const lookup = require('../utils/lookup');
const getTrend = require('../utils/get-trend');
const stratManager = require('../socket-server/strat-manager');
const PmPerfs = require('../models/PmPerfs');

// helpers
const roundTo = numDec => num => Math.round(num * Math.pow(10, numDec)) / Math.pow(10, numDec);
const oneDec = roundTo(1);
const twoDec = roundTo(2);


module.exports = async (Robinhood, min) => {

    const todaysDate = (await getFilesSortedByDate('daily-transactions'))[0];
    console.log(`Creating report for ${todaysDate}`);

    // get and record pm perfs
    await stratManager.init();
    const pmReport = stratManager.calcPmPerfs();
    console.log(`loaded ${pmReport.length} prediction models`);
    const pmData = { min, perfs: pmReport };
    await PmPerfs.updateOne(
        { date: todaysDate },
        { $set: pmData },
        { upsert: true }
    );

    console.log('saved pm perfs...');
    const forPurchaseAvgTrend = pmReport.find(({ pmName }) => pmName === 'forPurchase').avgTrend;
    console.log({ forPurchaseAvgTrend });

    // get account balance
    const [ account ] = (await Robinhood.accounts()).results;
    const portfolio = await Robinhood.url(account.portfolio);
    // console.log({ portfolio });
    const { extended_hours_equity, adjusted_equity_previous_close } = portfolio;
    const absoluteChange = twoDec(extended_hours_equity - adjusted_equity_previous_close);
    const percChange = getTrend(extended_hours_equity, adjusted_equity_previous_close);
    console.log(`Account balance: ${extended_hours_equity}`);
    console.log(`Since previous close: $${absoluteChange} (${percChange}%)`);

    // get sp500 trend
    const { afterHoursPrice, prevClose } = await lookup(Robinhood, 'SPY');
    const sp500Trend = getTrend(afterHoursPrice, prevClose);
    console.log(`S&P500 trend: ${sp500Trend}%`);

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
        pickToExecutionPerc: twoDec(holdReport.pickToExecutionPerc),
        sp500Trend,
        forPurchase: {
            avgTrend: twoDec(forPurchaseAvgTrend)
        }
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