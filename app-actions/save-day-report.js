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


module.exports = async (Robinhood, min = 515) => {

    const todaysDate = (await getFilesSortedByDate('daily-transactions'))[0];
    console.log(`Creating report for ${todaysDate} @ ${min} minutes`);

    // get and record pm perfs
    await stratManager.init({ dateOverride: todaysDate });
    const pmReport = stratManager.calcPmPerfs();
    console.log(`loaded ${pmReport.length} prediction models`);
    const pmData = { min, perfs: pmReport };
    await PmPerfs.updateOne(
        { date: todaysDate },
        { $set: pmData },
        { upsert: true }
    );

    console.log('saved pm perfs...');
    const forPurchasePerfs = (pmReport.find(({ pmName }) => pmName === 'forPurchase') || {}) || null;
    console.log({ forPurchasePerfs });

    // get account balance
    const [ account ] = (await Robinhood.accounts()).results;
    const portfolio = await Robinhood.url(account.portfolio);
    console.log({ portfolio });

    const uniqDates = await DayReport.getUniqueDates();
    console.log({ uniqDates, todaysDate });
    // const prevDay = await DayReport.findOne({ date: uniqDates[] })
    const { equity, adjusted_equity_previous_close } = portfolio;
    const absoluteChange = twoDec(equity - adjusted_equity_previous_close);
    const percChange = getTrend(equity, adjusted_equity_previous_close);
    console.log(`Account balance at close: ${equity}`);
    console.log(`Since previous close: $${absoluteChange} (${percChange}%)`);

    // get SPY trend
    const l = await lookup(Robinhood, 'SPY');
    console.log({ l })
    const { lastTrade, prevClose } = l;
    const spyTrend = getTrend(lastTrade, prevClose);
    console.log(`SPY trend: ${spyTrend}%`);

    // analyze sells and holds
    const sellReport = await sells(Robinhood, 1);
    const holdReport = await holds(Robinhood);

    // prep data for mongo
    const mongoData = {
        accountBalance: twoDec(equity),
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
        spyTrend,
        forPurchasePM: forPurchasePerfs
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