const stocks = require('../../stocks');
const HistoricalTickerWatcher = require('../../socket-server/historical-ticker-watcher');

let tickerWatcher;

module.exports = {
    name: 'ticker-watchers',
    run: [0],
    fn: async (Robinhood, min) => {
        console.log({ stocks })
        tickerWatcher = new HistoricalTickerWatcher(Robinhood, (relatedPrices, two) => {
            console.log({ relatedPrices, two })
        }, 5000);
        tickerWatcher.addTickers(stocks);
        tickerWatcher.start();
    }
}