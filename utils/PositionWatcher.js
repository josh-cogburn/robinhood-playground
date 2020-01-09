const INITIAL_TIMEOUT = 16 * 1000;      // 10 seconds
const END_AFTER = 2 * 1000 * 60 * 60;   // 2 hr

const getMinutesFromOpen = require('./get-minutes-from-open');
const lookup = require('./lookup');
const getTrend = require('./get-trend');
// const { avgArray } = require('./array-math');
const alpacaLimitSell = require('../alpaca/limit-sell');
const { alpaca } = require('../alpaca');
const sendEmail = require('./send-email');

module.exports = class PositionWatcher {
  constructor({ 
    ticker,
    initialTimeout = INITIAL_TIMEOUT,
    avgDownCount = 0,
  }) {
    Object.assign(this, {
      ticker,
      avgDownCount,
      timeout: initialTimeout,
      pendingSale: false,
      avgDownPrices: [],
      lastAvgDown: null
    });
    console.log('hey whats up from here')
    this.start();
  }
  start() {
    this.running = true;
    this.startTime = Date.now();
    this.observe();
  }
  getRelatedPosition() {
    const { ticker } = this;
    const stratManager = require('../socket-server/strat-manager');
    return (stratManager.positions.alpaca || []).find(pos => pos.ticker === ticker) || {};
  }
  async observe(isBeforeClose) {

    const shouldStopReason = this.shouldStop();
    if (shouldStopReason) {
      console.log(`stopping because ${shouldStopReason}`)
      this.running = false;
      return;
    }

    const {
      ticker,
      avgDownCount,
      pendingSale
    } = this;

    const {
      avgEntry,
      market_value,
      quantity
    } = this.getRelatedPosition();
    
    if (!avgEntry) return this.scheduleTimeout();

    const l = await lookup(ticker);
    strlog({ ticker, l })
    const { currentPrice, askPrice } = l;
    const prices = [
      currentPrice,
      askPrice
    ];
    const isSame = Boolean(JSON.stringify(prices) === JSON.stringify(this.prices));
    this.lastPrices = prices;

    const lowestPrice = Math.min(...prices);
    const lowestAvgDownPrice = Math.min(...this.avgDownPrices);
    const trendToLowestAvg = getTrend(lowestPrice, lowestAvgDownPrice);
    const returnPerc = getTrend(lowestPrice, avgEntry);

    strlog({
      ticker,
      avgEntry,
      prices,

      lowestPrice,
      trendToLowestAvg,
      returnPerc
    });
    console.log(`AVG-DOWNER: ${ticker} observed at ${currentPrice} ... avg buy at ${avgEntry} (${returnPerc}), lowest avg down price ${lowestAvgDownPrice} (${trendToLowestAvg}), and avg down count ${avgDownCount}, skipChecks ${skipChecks}`);
    const isRushed = this.lastAvgDown && Date.now() < this.lastAvgDown + 1000 * 60 * 5;
    const skipChecks = isRushed && isSame;
    if (skipChecks) {
      return this.scheduleTimeout();
    }

    if ([trendToLowestAvg, returnPerc].every(trend => !trend || trend < -3.25)) {
      this.avgDownCount++;
      const realtimeRunner = require('../realtime/RealtimeRunner');
      await realtimeRunner.handlePick({
        strategyName: 'avg-downer',
        ticker,
        keys: {
          [`${avgDownCount}count`]: true,
          [this.getMinKey()]: true,
          isBeforeClose
        },
        data: {
          returnPerc,
          trendToLowestAvg,
        }
      }, true);
      this.avgDownPrices.push(currentPrice);
      this.lastAvgDown = Date.now();
    } else if (!pendingSale && returnPerc >= 15) {
      const account = await alpaca.getAccount();
      const { portfolio_value, daytrade_count } = account;
      if (Number(market_value) > Number(portfolio_value) * 0.29) {
        if (daytrade_count <= 2) {
          await sendEmail(`Selling ${ticker} using a daytrade can we get 20% & 25% up?`);
          const firstChunk = Math.round(Number(quantity) / 2);
          const secondChunk = Number(quantity) - firstChunk;
          alpacaLimitSell({
            ticker,
            quantity: firstChunk,
            limitPrice: avgEntry * 1.2,
            timeoutSeconds: 60 * 20,
            fallbackToMarket: false
          });
          alpacaLimitSell({
            ticker,
            quantity: secondChunk,
            limitPrice: avgEntry * 1.25,
            timeoutSeconds: 60 * 20,
            fallbackToMarket: false
          });
          this.pendingSale = true;
        } else {
          await sendEmail(`You are at three daytrades but you might want to take a look at ${ticker}`);
        }
      } else {
        await sendEmail(`It's not a big deal (small amt) but you might want to check out ${ticker}`);
      }
      

    }

    this.scheduleTimeout();
  }
  shouldStop() {
    return Object.entries({
      notRunning: !this.running,
      hitEndAfter: this.timeout > END_AFTER,
      marketClosed: getMinutesFromOpen() > 390
    }).filter(([reason, boolean]) => boolean).map(([ reason ]) => reason).shift();
  }
  stop() {
    this.running = false;
  }
  scheduleTimeout() {
    console.log(`observing again in ${this.timeout / 1000} seconds (${(new Date(Date.now() + this.timeout).toLocaleTimeString())})`)
    this.TO = setTimeout(() => this.running && this.observe(), this.timeout);
    this.timeout = Math.min(this.timeout * 2, 1000 * 60 * 6);
  }
  newBuy() {
    this.timeout = INITIAL_TIMEOUT;
    clearTimeout(this.TO);
    this.TO = null;
    this.running = true;
    this.observe();
  }
  getMinKey() {
    if (!this.startTime) return null;
    const msPast = Date.now() - this.startTime;
    const minPast = Math.floor(msPast / 60000);
    const minKeys = [1, 5, 10, 30, 60, 120];
    const foundMinKey = minKeys.find(min => minPast < min);
    return foundMinKey ? `under${foundMinKey}min` : 'gt120min';
  }
}