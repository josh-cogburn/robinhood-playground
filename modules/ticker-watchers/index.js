const stocks = require('../../stocks');
const HistoricalTickerWatcher = require('../../socket-server/historical-ticker-watcher');

let tickerWatcher;
const bigJumps = [];
let relatedP;

module.exports = {
    name: 'ticker-watchers',
    run: [0],
    fn: async (Robinhood, min) => {
        console.log({ stocks })
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

        }, 50, true, () => {
            console.log()
            bigJumps.forEach(jump => {
                console.log(
                    jump,
                    relatedP[jump.ticker].pop().lastTradePrice
                )
            });
        });
        tickerWatcher.addTickers(stocks);
        tickerWatcher.start();
    }
};