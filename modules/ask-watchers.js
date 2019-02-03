const stocks = require('../stocks');
const allStocks = require('../json/stock-data/allStocks');
const HistoricalTickerWatcher = require('../socket-server/historical-ticker-watcher');
const lookupMultiple = require('../utils/lookup-multiple');
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
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
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
    name: 'ask-watchers',
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
                const allPrices = relatedPrices[key].map(obj => obj.askPrice);
                const mostRecent = allPrices.pop();
                const min = Math.min(...allPrices);
                const trendFromMin = getTrend(mostRecent, min);
                const bigJump = trendFromMin < -5;
                // console.log({ min, trendFromMin })
                if (bigJump && allPrices.length >= 3) {
                    console.log('found big jump', key, mostRecent, allPrices);
                    newJumps.push({
                        ticker: key,
                        jumpPrice: mostRecent,
                        trendFromMin,
                    });
                }
            }

            return newJumps;

        };
        
        tickerWatcher = new HistoricalTickerWatcher({
            name: 'ask-watchers',
            Robinhood,
            handler,
            timeout: 60000 * 2, // 5 min,
            runAgainstPastData: false,
            onPick: async pick => {

                const { jumpPrice: price, ticker, trendFromMin } = pick;

                // check against 5 minute historical data???
                let [fiveMinuteHistoricals] = await getMultipleHistoricals(
                    Robinhood,
                    [ticker],
                    'interval=5minute&span=day'
                );
                fiveMinuteHistoricals = fiveMinuteHistoricals.map(o => o.close_price);
                const failedHistoricalCheck = fiveMinuteHistoricals.slice(0, -1).some(p => getTrend(p, price) < 5);
                const historicalKey = failedHistoricalCheck ? 'failedHistorical' : '';

                const { shouldWatchout } = await getRisk(Robinhood, ticker);
                const jumpKey = (() => {
                    if (trendFromMin > -8) return 'minorJump';
                    if (trendFromMin < -13) return 'majorJump';
                })();
                const watchoutKey = shouldWatchout ? 'shouldWatchout' : 'notWatchout';
                const priceKeys = [1, 5, 10, 15, 20, 100];
                const priceKey = priceKeys.find(key => price < key);
                const min = getMinutesFrom630();
                const minKey = (() => {
                    if (min < 3) return 'initial';
                    if (min < 60) return 'brunch';
                    if (min < 200) return 'lunch';
                    return 'dinner';
                })();

                // const strategyName = `ask-watchers-under${priceKey}${watchoutKey}${jumpKey}${minKey}${historicalKey}`;

                const strategyName = [
                    'ask-watchers',
                    `under${priceKey}`,
                    watchoutKey,
                    jumpKey,
                    minKey,
                    historicalKey
                ].filter(Boolean).join('-');

                await sendEmail(`robinhood-playground: NEW JUMP DOWN ${strategyName}: ${ticker}`, JSON.stringify(pick, null, 2));
                await recordPicks(Robinhood, strategyName, 5000, [ticker]);
            },
            onEnd
        });

        const allUnder15 = await (async () => {
            const tickPrices = await lookupMultiple(Robinhood, allStocks.filter(isTradeable).map(o => o.symbol));
            return Object.keys(tickPrices).filter(ticker => tickPrices[ticker] < 20 && tickPrices[ticker] > 0.3);
        })();
        
        console.log({ allUnder15 });

        regCronIncAfterSixThirty(Robinhood, {
            name: `clear ask-watchers price cache`,
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
            console.log(JSON.stringify({ bigOvernightJumps }, null, 2));
        };

        regCronIncAfterSixThirty(Robinhood, {
            name: `set ask-watchers tickers (< $15 and no overnight jumps)`,
            run: [2],
            fn: setTickers
        });

        regCronIncAfterSixThirty(Robinhood, {
            name: `stop ask-watchers`,
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