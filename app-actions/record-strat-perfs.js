const fs = require('mz/fs');

const getTrend = require('../utils/get-trend');
const { avgArray } = require('../utils/array-math');
const jsonMgr = require('../utils/json-mgr');
const filterByTradeable = require('../utils/filter-by-tradeable');
const chunkApi = require('../utils/chunk-api');

const lookupTickers = async (Robinhood, tickersToLookup, includeAfterHours) => {
    // takes in array of tickers
    // returns object of tickers and current prices
    let quotes = await chunkApi(
        tickersToLookup,
        async (tickerStr) => {
            const url = `https://api.robinhood.com/quotes/?symbols=${tickerStr}`;
            // console.log(url);
            // console.log('ti', tickerStr);
            const { results } = await Robinhood.url(url);
            return results;
        },
        1630
    );
    // console.log(quotes, 'quotes')
    const tickerLookups = {};
    quotes.forEach(quote => {
        if (!quote) return;
        const {symbol, last_trade_price, last_extended_hours_trade_price} = quote;
        tickerLookups[symbol] = includeAfterHours ? {
            lastTradePrice: Number(last_trade_price),
            afterHourPrice: Number(last_extended_hours_trade_price)
        } : Number(last_trade_price);
    });
    return tickerLookups;
};

const analyzeDay = async (Robinhood, day) => {

    let files = await fs.readdir(`./json/picks-data/${day}`);
    console.log(`analyzing ${day}: ${files.length} files`);

    let tickerLookups = {};
    const strategyPicks = {};

    // load data from picks-data and keep track of tickers to lookup
    for (let file of files) {
        const strategyName = file.split('.')[0];
        const obj = await jsonMgr.get(`./json/picks-data/${day}/${file}`);
        // console.log(strategyName);
        // console.log(obj);

        for (let min of Object.keys(obj)) {
            // for each strategy run
            strategyPicks[`${strategyName}-${min}`] = obj[min];
            // if (obj[min].length) {
            //     strategyPicks[`${strategyName}-single-${min}`] = obj[min].slice(0, 1);
            // }
            // if (obj[min].length >= 3) {
            //     strategyPicks[`${strategyName}-first3-${min}`] = obj[min].slice(0, 3);
            // }
            obj[min].forEach(({ticker}) => {
                tickerLookups[ticker] = null;
            });
        }
    }

    // lookup prices of all tickers (chunked)
    const tickersToLookup = Object.keys(tickerLookups);
    // console.log(tickersToLookup, 'feaf')

    tickerLookups = await lookupTickers(Robinhood, tickersToLookup);

    // calc trend and avg for each strategy-min
    const withTrend = [];
    Object.keys(strategyPicks).forEach(stratMin => {
        // console.log('handling', stratMin);
        const picks = strategyPicks[stratMin]
            .filter(({ticker}) => filterByTradeable([ticker]).length);
        const picksWithTrend = picks.map(({ticker, price}) => ({
            ticker,
            thenPrice: price,
            nowPrice: tickerLookups[ticker],
            trend: getTrend(tickerLookups[ticker], price)
        }));
        withTrend.push({
            strategyName: stratMin,
            avgTrend: avgArray(picksWithTrend.map(pick => pick.trend)),
            picks: picksWithTrend.map(t => t.ticker).join(', ')
        });
    });
    // console.log(JSON.stringify(withTrend, null, 2));

    const sortedByAvgTrend = withTrend
        .filter(trend => trend.avgTrend)
        .sort((a, b) => b.avgTrend - a.avgTrend);

    // console.log(JSON.stringify(sortedByAvgTrend, null, 2));

    return sortedByAvgTrend;

};

module.exports = {
    lookupTickers,
    analyzeDay,
    default: async (Robinhood, min) => {

        // console.log('running record')
        // console.log(Robinhood, min);
        let folders = await fs.readdir('./json/picks-data');
        // console.log(folders);

        let sortedFolders = folders.sort((a, b) => {
            return new Date(a) - new Date(b);
        });


        console.log(sortedFolders);

        const perms = {
            'next-day': 2,
            'second-day': 3,
            'third-day': 4,
            'fourth-day': 5,
        };

        for (let [key, daysBack] of Object.entries(perms)) {
            console.log(key, daysBack);

            const pastDayDate = sortedFolders[sortedFolders.length - daysBack];
            if (!pastDayDate) {
                console.log(key, 'not enough picks-data to analyze within record-strat-perfs.');
                break;
            }
            const analyzed = await analyzeDay(Robinhood, pastDayDate);

            const curStratPerfs = await jsonMgr.get(`./json/strat-perfs/${pastDayDate}.json`) || {};
            curStratPerfs[`${key}-${min}`] = analyzed;
            await jsonMgr.save(`./json/strat-perfs/${pastDayDate}.json`, curStratPerfs);
            console.log(key, 'saved strat-perf');
        }

        console.log('done saving strat-perfs!');
    }

};
