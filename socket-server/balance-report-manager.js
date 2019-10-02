const NUM_DAYS_TO_LOAD = 6;

const START_MIN = -210;//51;    // 3am
const STOP_MIN = 811;
const TIMEOUT_SECONDS = 15;

const BalanceReport = require('../models/BalanceReport');

const stratManager = require('./strat-manager');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');

const dayInProgress = require('../realtime/day-in-progress');
const getBalanceReport = require('./get-balance-report');

// inner
let timeout;
let isRunning;
let allBalanceReports = [];
let onReport;

const init = async (onReportFn) => {
    onReport = onReportFn;
    let foundReports = await BalanceReport.find().lean();

    const getReportDate = r => (new Date(r.time)).toLocaleDateString();

    const uniqDates = foundReports.map(getReportDate).uniq();
    const startAtDate = uniqDates[uniqDates.length - NUM_DAYS_TO_LOAD];
    foundReports = foundReports.slice(
        foundReports.findIndex(
            r => getReportDate(r) === startAtDate
        )
    );

    // console.log('init balance reports', Object.keys(stratManager));
    console.log('foundReports', foundReports.length);
    allBalanceReports = foundReports;
    regCronIncAfterSixThirty({
        name: 'start balance report manager',
        run: [START_MIN],
        fn: start
    });
    regCronIncAfterSixThirty({
        name: 'stop balance report manager',
        run: [STOP_MIN],
        fn: stop
    });

    // if between start and end times then start() on init
    const min = getMinutesFrom630();
    console.log({ currentMin: min });
    if (dayInProgress(START_MIN, STOP_MIN)) {
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
    console.log('runAndSetTimeout', { isRunning });
    if (!isRunning) return;
    const min = getMinutesFrom630();
    const isRegularHours = min > -30 && min < 390;
    await getAndSaveBalanceReport(isRegularHours);
    const toSeconds = isRegularHours ? TIMEOUT_SECONDS : TIMEOUT_SECONDS * 12;
    timeout = setTimeout(runAndSetTimeout, toSeconds * 1000);
};

const getAndSaveBalanceReport = async (isRegularHours) => {
    // console.log('hereee');
    try {
        const report = await getBalanceReport(isRegularHours);
        const mongoDoc = await BalanceReport.create(report);
        // console.log(
        //     'mongodb',
        //     mongoDoc
        // );
        allBalanceReports.push(mongoDoc);
        onReport(mongoDoc);
    } catch (e) {
        console.error(e);
    }
};

const getAllBalanceReports = () => allBalanceReports;

const stop = () => {
    console.log('stopping balance reports')
    isRunning = false;
    clearTimeout(timeout);
    timeout = null;
};

module.exports = {
    init,
    start,
    stop,
    getAllBalanceReports,
    getAndSaveBalanceReport
};