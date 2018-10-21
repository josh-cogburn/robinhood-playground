

// console.log(stocks);
const login = require('./rh-actions/login');
// const initCrons = require('./app-actions/init-crons');
const initModules = require('./app-actions/init-modules');

const getAllTickers = require('./rh-actions/get-all-tickers');
const cancelAllOrders = require('./rh-actions/cancel-all-orders');
const logPortfolioValue = require('./app-actions/log-portfolio-value');
// const getPennyStocks = require('./analysis/get-penny-stocks');
// const activeBuy = require('./app-actions/active-buy');
const detailedNonZero = require('./app-actions/detailed-non-zero');

let Robinhood, allTickers;

const regCronIncAfterSixThirty = require('./utils/reg-cron-after-630');
// const rh = require('./shared-async/rh');
const sellAllStocks = require('./app-actions/sell-all-stocks');
// const up10days = require('./strategies/up-10-days');
// const getUpStreak = require('./app-actions/get-up-streak');

const sellAllOlderThanTwoDays = require('./app-actions/sell-all-older-than-two-days');

const mongoose = require('mongoose');
const { mongoConnectionString } = require('./config');

const Pick = require('./models/Pick');

mongoose.connect(mongoConnectionString, { useNewUrlParser: true });

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

(async () => {

    // console.log(
    //     await Pick.create({
    //         date: '10-4-2018',
    //         strategyName: 'based-on-jump',
    //         min: 20,
    //         picks: [
    //             {
    //                 ticker: 'APPL',
    //                 price: 32.93
    //             },
    //             {
    //                 ticker: 'BPMX',
    //                 price: 3.93
    //             }
    //         ]
    //     })
    // );

    Robinhood = await login();
    global.Robinhood = Robinhood;

    require('./socket-server');
    // console.log(await getUpStreak(Robinhood, 'AAPL', 3));
    // await up10days.trendFilter(Robinhood, require('/Users/johnmurphy/Development/my-stuff/robinhood-playground/json/stock-data/2018-1-22 12:53:02 (+380*).json'));

    // console.log(await getPennyStocks(Robinhood, require('/Users/johnmurphy/Development/my-stuff/robinhood-playground/json/stock-data/2018-1-23 13:04:23 (+391).json')));
    // await logPortfolioValue(Robinhood);
    // does the list of stocks need updating?

    // const detailed = await detailedNonZero(Robinhood);
    // console.log(detailed);
    try {
        allTickers = require('./json/stock-data/allStocks');
        // throw new Error();
    } catch (e) {
        allTickers = await getAllTickers(Robinhood);
    }
    allTickers = allTickers
        .filter(stock => stock.tradeable)
        .map(stock => stock.symbol);

    await cancelAllOrders(Robinhood);

    try {
        await logPortfolioValue(Robinhood);
    } catch (e) {
        console.log(e);
    }


    await initModules(Robinhood);
    regCronIncAfterSixThirty.display();


    const accounts = await Robinhood.accounts();
    // const ratioToSpend = Math.max(0.3, getMinutesFrom630() / 390);
    const cashAvailable = Number(accounts.results[0].margin_balances.unallocated_margin_cash);
    console.log(cashAvailable);
    // await sellAllStocks(Robinhood);

    // startCrons();

})();
