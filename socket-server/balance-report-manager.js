const TIMEOUT_SECONDS = 15;

const BalanceReport = require('../models/BalanceReport');
const getAccountBalance = require('../utils/get-account-balance');
const getIndexes = require('../utils/get-indexes');

const stratManager = require('./strat-manager');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

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
        run: [-300],
        fn: start
    });
    regCronIncAfterSixThirty(rh, {
        name: 'stop balance report manager',
        run: [600],
        fn: stop
    });
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