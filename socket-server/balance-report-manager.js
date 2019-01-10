const START_MIN = -30;
const STOP_MIN = 350;
const TIMEOUT_SECONDS = 15;

const BalanceReport = require('../models/BalanceReport');
const getAccountBalance = require('../utils/get-account-balance');
const getIndexes = require('../utils/get-indexes');

const stratManager = require('./strat-manager');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');

// inner
let timeout;
let isRunning;
let Robinhood;
let allBalanceReports = [];
let onReport;

const init = async (rh, onReportFn) => {
    Robinhood = rh;
    onReport = onReportFn;
    const foundReports = await BalanceReport.find().lean();
    console.log('init balance reports', Object.keys(stratManager));
    console.log('foundReports', foundReports);
    allBalanceReports = foundReports;
    regCronIncAfterSixThirty(rh, {
        name: 'start balance report manager',
        run: [START_MIN],
        fn: start
    });
    regCronIncAfterSixThirty(rh, {
        name: 'stop balance report manager',
        run: [STOP_MIN],
        fn: stop
    });

    // if between start and end times then start() on init
    const min = getMinutesFrom630();
    console.log({ currentMin: min });
    if (min > START_MIN && min < STOP_MIN) {
        console.log('starting because day in progress');
        await start();
    } else {
        console.log('not starting because outside of balance report times');
    }

    return allBalanceReports;
};

const start = async () => {
    if (isRunning) {
        return console.log('balance report manager already running');
    }
    console.log('starting balance report manager');
    isRunning = true;
    return runAndSetTimeout();
};

const runAndSetTimeout = async () => {
    console.log('runAndSetTimeout')
    await getAndSaveBalanceReport();
    const toFn = () => isRunning && runAndSetTimeout();
    timeout = setTimeout(toFn, TIMEOUT_SECONDS * 1000);
};

const getAndSaveBalanceReport = async () => {
    console.log('hereee')
    const report = {
        ...await getAccountBalance(Robinhood),
        indexPrices: await getIndexes()
    };
    const mongoDoc = await BalanceReport.create(report);
    console.log(
        'mongodb',
        mongoDoc
    );
    allBalanceReports.push(mongoDoc);
    onReport(mongoDoc);
};

const getAllBalanceReports = () => allBalanceReports;

const stop = () => {
    isRunning = false;
    clearTimeout(timeout);
    timeout = null;
};

module.exports = {
    init,
    start,
    stop,
    getAllBalanceReports
};