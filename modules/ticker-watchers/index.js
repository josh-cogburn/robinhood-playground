const stocks = require('../../stocks');
const allStocks = require('../../json/stock-data/allStocks');
const HistoricalTickerWatcher = require('../../socket-server/historical-ticker-watcher');
const { lookupTickers } = require('../../app-actions/record-strat-perfs');
const getTrend = require('../../utils/get-trend');

let tickerWatcher;
let bigJumps = [];
let relatedP;

const onEnd = () => {
    console.log();
    bigJumps = bigJumps
        .map(jump => ({
            ...jump,
            finalPrice: relatedP[jump.ticker].pop().lastTradePrice
        }))
        .map(jump => ({
            ...jump,
            trend: getTrend(jump.finalPrice, jump.jumpPrice)
        }))
    bigJumps.forEach(console.log);
};


module.exports = {
    name: 'ticker-watchers',
    run: [0],
    fn: async (Robinhood, min) => {
        console.log({ stocks, allStocks });


        const tickPrices = await lookupTickers(Robinhood, allStocks.map(o => o.symbol));
        const allUnder5 = Object.keys(tickPrices).filter(ticker => tickPrices[ticker] < 5);
        
        console.log({ allUnder5 })
        
        tickerWatcher = new HistoricalTickerWatcher(Robinhood, (relatedPrices, two) => {
            // console.log({ relatedPrices, two });
            relatedP = relatedPrices;
            Object.keys(relatedPrices).forEach(key => {
                const allPrices = relatedPrices[key].map(obj => obj.lastTradePrice);
                const mostRecent = allPrices.pop();
                const bigJump = allPrices.every(p => mostRecent < p * 0.98);
                if (bigJump && allPrices.length) {
                    console.log('found big jump', key, mostRecent, allPrices.length);
                    bigJumps.push({
                        ticker: key,
                        jumpPrice: mostRecent
                    });
                }
            });

        }, 50, true, onEnd);
        tickerWatcher.addTickers(allUnder5);
        tickerWatcher.start();
    }
};