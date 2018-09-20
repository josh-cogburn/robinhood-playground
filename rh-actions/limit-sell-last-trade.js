const jsonMgr = require('../utils/json-mgr');
// const scrapeYahooPrice = require('../app-actions/scrape-yahoo-price');
const lookup = require('../utils/lookup');
const alreadyBoughtToday = require('./already-bought-today');

const boughtThisStockToday = async (Robinhood, ticker) => {
    // const fileName = `./json/daily-transactions/${(new Date()).toLocaleDateString().split('/').join('-')}.json`;
    // const curTransactions = await jsonMgr.get(fileName) || [];
    // return curTransactions.some(transaction => {
    //     return transaction.ticker === ticker && transaction.type === 'buy';
    // });
    return alreadyBoughtToday(Robinhood, ticker);
};

module.exports = async (Robinhood, {
    ticker,
    quantity = 1,
    bidPrice
}) => {
    console.log('limit selling', ticker);

    if (await boughtThisStockToday(Robinhood, ticker)) {
        console.log('not selling ', ticker, 'because bought today');
        return { detail: 'not selling ' + ticker + 'because bought today'};
    }

    const {
        currentPrice,
        instrument
    } = (await lookup(Robinhood, ticker));
    bidPrice = bidPrice || currentPrice;

    bidPrice = +(Number(bidPrice).toFixed(2));

    var options = {
        type: 'limit',
        quantity,
        bid_price: bidPrice,
        instrument: {
            url: instrument,
            symbol: ticker
        }
        // // Optional:
        // trigger: String, // Defaults to "gfd" (Good For Day)
        // time: String,    // Defaults to "immediate"
        // type: String     // Defaults to "market"
    };

    console.log(options);
    const res = await Robinhood.place_sell_order(options);
    console.log('limit sell response', res);
    return res;
};
