const { lookupTickers } = require('../app-actions/record-strat-perfs');

class TickerWatcher {
    constructor({ name, Robinhood, handler, timeout = 40000 }) {
        this.name = name;
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
    removeTickers(tickers) {
        console.log('before', this.tickersWatching.length);
        this.tickersWatching = this.tickersWatching.filter(t => !tickers.includes(t));
        console.log('after', this.tickersWatching.length);
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
        console.log(this.name, 'getRelatedPrices');
        console.log(this.name, 'getting related prices', tickersWatching.length);
        // console.log(JSON.stringify(tickersToLookup));
        const relatedPrices = await lookupTickers(
            Robinhood,
            tickersWatching,
            true
        );

        this.relatedPrices = relatedPrices;
        console.log(this.name, 'done getting related prices');
        return handler(relatedPrices);

        // console.log(relatedPrices)
        // console.log(JSON.stringify(relatedPrices, null, 2));
    }
}

module.exports = TickerWatcher;