// steps
// 1. get list of current positions
// 2. look within the daily-transactions and find which day that stock was bought and which strategy was responsible for the purchase
// 3. look at the strat-perfs for the transaction
// 4. run the playoutFn (strategy-perf-multiple) related to the current settings.js sellStrategy on that list of breakdowns
// 5. sell all that are > 4 days old or the output of playoutFn shows that it hit the playout at some point


const fs = require('mz/fs');
const mapLimit = require('promise-map-limit');
const jsonMgr = require('../utils/json-mgr');

const detailedNonZero = require('./detailed-non-zero');
const activeSell = require('./active-sell');
const getTrend = require('../utils/get-trend');

// the magic
const { sellStrategy, sellAllStocksOnNthDay } = require('../settings');
const playouts = require('../analysis/strategy-perf-multiple/playouts');

const determineSingleBestPlayoutFromMultiOutput = require(
    '../analysis/strategy-perf-multiple/one-off-scripts/determine-best-playout'
);

// utils
const getFilesSortedByDate = async jsonFolder => {
    let files = await fs.readdir(`./json/${jsonFolder}`);
    return files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b))
        .reverse();
};

const daysBetween = (firstDate, secondDate) => {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    return diffDays;
};



const getAssociatedStrategies = async (tickers, dailyTransactionDates) => {

    const withStrategies = [];  // [{ ticker, strategy }]
    const withStrategiesIncludesTicker = ticker =>
        withStrategies
            .map(obj => obj.ticker)
            .includes(ticker);

    for (let file of dailyTransactionDates) {
        // console.log('checking', file, withStrategies);
        const transactions = await jsonMgr.get(`./json/daily-transactions/${file}.json`);
        // console.log(transactions);
        tickers
            .filter(ticker => !withStrategiesIncludesTicker(ticker))
            .forEach(ticker => {
                const foundStrategy = transactions.find(transaction =>
                    transaction.ticker === ticker
                    && transaction.type === 'buy'
                );
                // console.log(ticker, 'found', foundStrategy);
                if (!foundStrategy)  return;
                const { strategy, min } = foundStrategy;
                withStrategies.push({
                    ticker,
                    strategy: `${strategy}-${min}`,
                    date: file
                });
            });

        if (tickers.every(withStrategiesIncludesTicker)) {
            console.log('found all tickers');
            break;
        }
    }

    return withStrategies;
};

const getStratPerfTrends = async (ticker, buyDate, strategy) => {
    try {
        const stratPerfObj = await jsonMgr.get(`./json/strat-perfs/${buyDate}.json`);
        const trends = [];
        Object.keys(stratPerfObj).forEach(key => {
            const foundPerf = stratPerfObj[key].find(obj => obj.strategyName === strategy);
            if (foundPerf) {
                trends.push(
                    foundPerf.avgTrend
                );
            }
        });
        return trends;
    } catch (e) {
        return null;
    }
};

// do it

module.exports = async (Robinhood, dontActuallySellFlag) => {

    // helper action fns
    const sellPosition = async ({ ticker, quantity }, whySelling) => {
        try {
            console.log(`selling ${ticker} because ${whySelling}`);
            if (dontActuallySellFlag) return;
            const response = await activeSell(
                Robinhood,
                { ticker, quantity }
            );
            console.log(`sold ${quantity} shares of ${ticker} because ${whySelling}`, response);
        } catch (e) {
            console.log(`error selling ${ticker} because ${whySelling}`, e);
        }
    };

    const dailyTransactionDates = await getFilesSortedByDate('daily-transactions');
    const pmModelDates = await getFilesSortedByDate('prediction-models');
    // console.log(dailyTransactionDates, 'dailyTransactionDates');
    // console.log(pmModelDates, 'pmModelDates');

    const nonzero = await detailedNonZero(Robinhood);
    const withStrategies = await getAssociatedStrategies(
        nonzero.map(pos => pos.symbol),
        dailyTransactionDates
    );
    const combined = nonzero.map(pos => ({
        ...pos,
        ...withStrategies.find(obj => obj.ticker === pos.symbol),
        ticker: pos.symbol
    }));

    const calcDayAgeFromPosition = pos => {
        const { date, updated_at } = pos;
        console.log(date, updated_at, pos.ticker)
        if (date) {
            const getIndexFromDateList = dateList => dateList.findIndex(d => d === date);
            const pmIndex = getIndexFromDateList(pmModelDates);
            return pmIndex !== -1 ? pmIndex : getIndexFromDateList(dailyTransactionDates);
        } else {
            return daysBetween(new Date(), new Date(pos.updated_at));
        }
    };

    const withAge = combined.map(pos => ({
        ...pos,
        dayAge: calcDayAgeFromPosition(pos)
    }));

    // console.log(withAge.length);

    withAge.forEach(pos => {
        console.log(
            pos.symbol,
            pos.dayAge + ' days old'
        );
    });

    // handle older than four days
    const olderThanNDays = withAge.filter(pos => pos.dayAge >= sellAllStocksOnNthDay);
    await mapLimit(olderThanNDays, 3, async pos => {
        await sellPosition({
            ticker: pos.symbol,
            quantity: pos.quantity
        }, `older than ${sellAllStocksOnNthDay} days: ${pos.dayAge}`);
    });


    // handle under four days (but not bought today) check for playout strategy
    let underNDays = withAge.filter(pos => pos.dayAge >= 1 && pos.dayAge < sellAllStocksOnNthDay);
    if (!underNDays.length) return;
    const highestPlayouts = await determineSingleBestPlayoutFromMultiOutput(
        Robinhood,
        ...underNDays.map(pos => pos.strategy)
    );
    // console.log(highestPlayouts, 'highestPlayouts')
    underNDays = underNDays.map(pos => ({
        ...pos,
        highestPlayout: highestPlayouts.find(obj => obj.strategy === pos.strategy).highestPlayout
    }));

    // console.log('underNDays', underNDays);
    for (let pos of underNDays) {
        // const strategy = await findStrategyThatPurchasedTicker(pos.symbol);
        const breakdowns = await getStratPerfTrends(pos.ticker, pos.date, pos.strategy) || [];
        if (!breakdowns.length) {
            breakdowns.push(
                getTrend(
                    pos.currentPrice,
                    pos.average_buy_price
                )
            );
        }
        const playoutToRun = pos.highestPlayout || sellStrategy;
        pos.playoutToRun = playoutToRun;
        const playoutFn = playouts[playoutToRun].fn;
        const { hitFn: hitPlayout } = playoutFn(breakdowns);
        pos.hitPlayout = hitPlayout;
        console.log(pos.ticker, breakdowns, 'playout', playoutToRun, 'hitPlayout', hitPlayout);
    }

    // sell all under 4 days that hit the playoutFn
    await mapLimit(underNDays.filter(pos => pos.hitPlayout), 3, async pos => {
        await sellPosition(pos, `hit ${pos.playoutToRun} playout`);
    });


};
