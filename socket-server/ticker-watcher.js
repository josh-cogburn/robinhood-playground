const { lookupTickers } = require('../app-actions/record-strat-perfs');

class TickerWatcher {
    constructor(Robinhood, handler, timeout = 40000) {
        this.Robinhood = Robinhood;
        this.handler = handler;
        this.relatedPrices = {};
        this.running = false;
        this.timeout = timeout;
        this.tickersWatching = [];
    }
    // tickersRegistered = {}; // { AAPL: ['strategies'] }
    addTickers(tickers) {
        this.tickersWatching = [
            ...new Set(
                [...this.tickersWatching, ...tickers]
            )
        ];
    }
    clearTickers() {
        this.tickersWatching = [];
    }
    start() {
        this.running = true;
        this.lookupAndWaitPrices();
    }
    stop() {
        this.running = false;
    }
    lookupAndWaitPrices() {
        if (!this.running) return;
        this.lookupRelatedPrices();
        setTimeout(() => this.lookupAndWaitPrices(), this.timeout);
    }
    async lookupRelatedPrices() {
        const { Robinhood, tickersWatching, handler } = this;
        // console.log(this.picks);
        console.log('getRelatedPrices');
        console.log('getting related prices', tickersWatching.length);
        // console.log(JSON.stringify(tickersToLookup));
        const relatedPrices = await lookupTickers(
            Robinhood,
            tickersWatching,
            true
        );
        this.relatedPrices = relatedPrices;
        console.log('done getting related prices');
        return handler(relatedPrices);

        // console.log(relatedPrices)
        // console.log(JSON.stringify(relatedPrices, null, 2));
    }
}

module.exports = TickerWatcher;