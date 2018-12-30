const TickerWatcher = require('./ticker-watcher');

class HistoricalTickerWatcher extends TickerWatcher {
    constructor(...args) {
        super(...args);
        const curHandler = this.handler;
        this.handler = relatedPrices => {

            return curHandler(relatedPrices, 5);
        }
    }
}

module.exports = HistoricalTickerWatcher;