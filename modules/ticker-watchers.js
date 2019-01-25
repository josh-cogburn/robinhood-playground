const stocks = require('../stocks');
const allStocks = require('../json/stock-data/allStocks');
const HistoricalTickerWatcher = require('../socket-server/historical-ticker-watcher');
const { lookupTickers } = require('../app-actions/record-strat-perfs');
const getTrend = require('../utils/get-trend');
const { isTradeable } = require('../utils/filter-by-tradeable');
const { avgArray } = require('../utils/array-math');
const sendEmail = require('../utils/send-email');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const recordPicks = require('../app-actions/record-picks');
const addOvernightJumpAndTSO = require('../app-actions/add-overnight-jump-and-tso');
const getTrendSinceOpen = require('../rh-actions/get-trend-since-open');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const getRisk = require('../rh-actions/get-risk');

let tickerWatcher;
let relatedP;

const onEnd = allPicks => {
    console.log(allPicks);
    allPicks = allPicks
        .map(jump => ({
            ...jump,
            finalPrice: relatedP[jump.ticker].pop().lastTradePrice
        }))
        .map(jump => ({
            ...jump,
            trend: getTrend(jump.finalPrice, jump.jumpPrice)
        }))
        .sort((a, b) => b.trendFromMin - a.trendFromMin);
    
    console.log('HERE');
    console.log(JSON.stringify(allPicks, null ,2))


    const avgTrend = avgArray(allPicks.map(j => j.trend));
    console.log({ avgTrend });
    allPicks.forEach(jump => console.log(jump));
    tickerWatcher.stop();
    tickerWatcher = null;
};



module.exports = {
    name: 'ticker-watchers',
    init: async (Robinhood) => {

        // setTimeout(async () => {
        //     console.log('recording based-on-jump-fourToEightOvernight-trending35257-gt500kvolume-first2-5');
        //     await recordPicks(Robinhood, 'based-on-jump-fourToEightOvernight-trending35257-gt500kvolume-first2', 5, ['BPMX']);
        // }, 10000);

        const handler = async relatedPrices => {
            // console.log({ relatedPrices, two });
            relatedP = relatedPrices;
            const newJumps = [];
            for (let key of Object.keys(relatedPrices)) {
                const allPrices = relatedPrices[key].map(obj => obj.lastTradePrice);
                const mostRecent = allPrices.pop();
                const min = Math.min(...allPrices);
                const trendFromMin = getTrend(mostRecent, min);
                const bigJump = trendFromMin < -8;
                // console.log({ min, trendFromMin })
                if (bigJump && allPrices.length >= 3) {
                    console.log('found big jump', key, mostRecent, allPrices);
                    newJumps.push({
                        ticker: key,
                        jumpPrice: mostRecent,
                        trendFromMin
                    });
                }
            }

            return newJumps;

        };
        
        tickerWatcher = new HistoricalTickerWatcher({
            name: 'ticker-watchers',
            Robinhood,
            handler,
            timeout: 60000 * 2, // 5 min,
            runAgainstPastData: false,
            onPick: async pick => {

                const { jumpPrice: price, ticker } = pick;
                let [allHistoricals] = await getMultipleHistoricals(
                    Robinhood,
                    [ticker],
                    'interval=5minute&span=day'
                );
                allHistoricals = allHistoricals.map(o => o.close_price);
                console.log({ price });

                // check against 5 minute historical data???
                if (allHistoricals.slice(0, -1).some(p => getTrend(p, price) < 5)) {
                    console.log('did not pass historical data test');
                    return;
                }

                const { shouldWatchout } = await getRisk(Robinhood, ticker);
                const watchoutKey = shouldWatchout ? '-shouldWatchout' : '';
                const priceKeys = [1, 5, 10, 15, 20];
                const priceKey = priceKeys.find(key => price < key);

                const strategyName = `ticker-watchers-under${priceKey}${watchoutKey}`;

                await sendEmail(`robinhood-playground: NEW JUMP DOWN ${strategyName}: ${ticker}`, JSON.stringify(pick, null, 2));
                await recordPicks(Robinhood, strategyName, 5000, [ticker]);
            },
            onEnd
        });

        const allUnder15 = await (async () => {
            const tickPrices = await lookupTickers(Robinhood, allStocks.filter(isTradeable).map(o => o.symbol));
            return Object.keys(tickPrices).filter(ticker => tickPrices[ticker] < 20 && tickPrices[ticker] > 1);
        })();
        
        console.log({ allUnder15 });

        regCronIncAfterSixThirty(Robinhood, {
            name: `clear ticker-watchers price cache`,
            run: [-330],    // start of pre market
            fn: () => tickerWatcher.clearPriceCache()
        });

        const setTickers = async () => {
            // all under $15 and no big overnight jumps
            tickerWatcher.clearTickers();
            tickerWatcher.addTickers(allUnder15);
            const trend = await getTrendSinceOpen(Robinhood, allUnder15);
            const withOvernightJumps = await addOvernightJumpAndTSO(Robinhood, trend);
            // str({ withOvernightJumps })
            const bigOvernightJumps = withOvernightJumps
                .filter(o => o.overnightJump > 7)
                .map(t => t.ticker);
                
            tickerWatcher.removeTickers(bigOvernightJumps);
            // console.log(JSON.stringify({ bigOvernightJumps }, null, 2));
        };

        regCronIncAfterSixThirty(Robinhood, {
            name: `set ticker-watchers tickers (< $15 and no overnight jumps)`,
            run: [2],
            fn: setTickers
        });

        regCronIncAfterSixThirty(Robinhood, {
            name: `stop ticker-watchers`,
            run: [500],
            fn: () => tickerWatcher.stop()
        });

        await setTickers();
        tickerWatcher.start();

    }
};



// module.exports = {
//     name: 'quick-drops',
//     crons: 

// }