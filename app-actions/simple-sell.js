const { force: { keep: keepers } } = require('../settings');

const howMuchBoughtToday = require('./how-much-bought-today');
const limitSellLastTrade = require('../rh-actions/limit-sell-last-trade');
const jsonMgr = require('../utils/json-mgr');
const lookup = require('../utils/lookup');

const MINUTES_BEFORE_CANCEL = 30;

const addToDailyTransactions = async data => {
    const fileName = `./json/daily-transactions/${(new Date()).toLocaleDateString().split('/').join('-')}.json`;
    const curTransactions = await jsonMgr.get(fileName) || [];
    curTransactions.push(data);
    await jsonMgr.save(fileName, curTransactions);
};

const calcQuantity = (maxPrice, bidPrice) => {
    let quantity = Math.floor(maxPrice / bidPrice);
    if (quantity === 0 && bidPrice < 50) {
        quantity = 1;
    }
    return quantity;
};

module.exports = async (
    Robinhood,
    { ticker, quantity }
) => {

    if (keepers.includes(ticker)) {
        throw 'ticker on keeper list';
    }

    const boughtToday = await howMuchBoughtToday(Robinhood, ticker) || 0;
    if (boughtToday > 0) {
        throw 'already bought today: ' + ticker;
    }

    let { lastTrade, bidPrice: b } = await lookup(Robinhood, ticker);
    bidPrice = Math.max(lastTrade * 0.95, b);
    str({ ticker, lastTrade, bidPrice, b })
    const purchase = await limitSellLastTrade(
        Robinhood,
        {
            ticker,
            bidPrice,
            quantity,
        }
    );

    const timeout = 1000 * 60 * MINUTES_BEFORE_CANCEL;
    await new Promise(resolve => setTimeout(resolve, timeout));

    // check state of order
    const { state } = await Robinhood.url(purchase.url);
    const filled = state === 'filled';
    str({ ticker, filled });

    if (filled) {
        // update daily transactions
        await addToDailyTransactions({
            type: 'buy',
            ticker,
            bid_price: bidPrice,
            quantity,
            strategy,
            min
        });
    } else {
        log('failed selling', {
            ticker,
            strategy,   // strategy name
            maxPrice,   // total amount to spend
            min,
            pickPrice
        });
    }
};