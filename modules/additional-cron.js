// analysis
const stratPerfMultiple = require('../analysis/strategy-perf-multiple');

// app actions
const getTrendAndSave = require('../app-actions/get-trend-and-save');
const logPortfolioValue = require('../app-actions/log-portfolio-value');
const { default: recordStratPerfs } = require('../app-actions/record-strat-perfs');
const doubleDown = require('../app-actions/double-down');

// const sellAllOlderThanTwoDays = require('../app-actions/sell-all-older-than-two-days');
const sellAllBasedOnPlayout = require('../app-actions/sell-all-based-on-playout');
const sellAllIfWentUp = require('../app-actions/sell-all-if-went-up');
const sellAllStocks = require('../app-actions/sell-all-stocks');
const sendDayReport = require('../app-actions/send-day-report');

// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const timeoutPromise = require('../utils/timeout-promise');

// rh actions
const getAllTickers = require('../rh-actions/get-all-tickers');

// socket-server
const stratManager = require('../socket-server/strat-manager');

const additionalCron = [
    // {
    //     name: 'sell all stocks',
    //     run: [5],
    //     fn: (Robinhood) => {
    //
    //         setTimeout(async () => {
    //             // daily at 6:30AM + 4 seconds
    //             await sellAllStocks(Robinhood);
    //             console.log('done selling all');
    //             //
    //             // timeoutPromise(5000);
    //             // console.log('selling all stocks that went up');
    //             // await sellAllIfWentUp(Robinhood);
    //             // console.log('logging portfolio value');
    //             // await logPortfolioValue(Robinhood);
    //
    //         }, 8);
    //
    //     }
    // },
    // sell all if went up
    // {
    //     name: 'sellAllIfWentUp',
    //     run: [1],
    //     fn: sellAllIfWentUp
    // },
    // sell all based on playout
    {
        name: 'sellAllBasedOnPlayout',
        run: [0, 35],
        fn: () => sellAllBasedOnPlayout(Robinhood)
    },

    // sell all if went up
    // {
    //     name: 'sellAllStocks',
    //     run: [8],   // 12pm
    //     fn: sellAllStocks
    // },
    // log port value
    // {
    //     name: 'log the portfolio value',
    //     run: [195, 292],
    //     fn: logPortfolioValue
    // },
    // log the trend
    // {
    //     name: 'log the trend',
    //     run: [75, 105, 180],
    //     fn: getTrendAndSave
    // },
    // record prev day strat performances,
    {
        name: 'record-strat-perfs, refresh past data, and sell all based on playout',
        run: [9],
        fn: async (Robinhood, min) => {
            await recordStratPerfs(Robinhood, min);
            await stratManager.refreshPastData();
        }
    },
    {
        name: 'record-strat-perfs, and sell all based on playout',
        run: [85, 230, 330],
        fn: async (Robinhood, min) => {
            await recordStratPerfs(Robinhood, min);
            await sellAllBasedOnPlayout(Robinhood);
        }
    },
    //sellAllOlderThanTwoDays
    // {
    //     name: 'sell all if older than one day',
    //     run: [45],
    //     fn: sellAllOlderThanTwoDays
    // },
    {
        name: 'getAllTickers',
        run: [1027, 70, 200],
        fn: getAllTickers
    },

    {
        name: 'doubleDown',
        run: [200, 378],
        fn: doubleDown
    },

    // {
    //     name: 'commit day to git',
    //     run: [1027],
    //     fn: getAllTickers
    // },
    {
        name: 'send day report',
        run: [515],
        fn: sendDayReport
    },

    {
        name: 'strat perf multiple',
        run: [520],
        fn: (Robinhood) => stratPerfMultiple(Robinhood, 52, 'next-day-330')
    },

    // {
    //     name: 'commit strat-perf-multiple to git'
    // }


];

module.exports = additionalCron;
