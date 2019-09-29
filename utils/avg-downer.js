const INITIAL_TIMEOUT = 10 * 1000;      // 10 seconds
const END_AFTER = 2 * 1000 * 60 * 60;   // 2 hr

const getMinutesFrom630 = require('./get-minutes-from-630');
const lookup = require('./lookup');
const getTrend = require('./get-trend');

module.exports = class AvgDowner {
  constructor({ 
    ticker, 
    buyPrice, 
    initialTimeout = INITIAL_TIMEOUT, 
    strategy,
  }) {
    Object.assign(this, {
      ticker,
      buyPrices: [buyPrice],
      timeout: initialTimeout,
      strategy
    });
    this.start();
  }
  start() {
    this.running = true;
    this.startTime = Date.now();
    this.observe();
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
      buyPrices,
      strategy
    } = this;

    const l = await lookup(ticker);
    strlog({ l })
    const { currentPrice, askPrice } = l;
    const observePrice = avgArray([currentPrice, askPrice]);
    const avgBuy = avgArray(...buyPrices);
    const trendDown = getTrend(observePrice, avgBuy);
    strlog({
      buyPrices,
      avgBuy,
      currentPrice,
      askPrice,
      observePrice
    });
    console.log(`AVG-DOWNER: ${ticker} observed at ${observePrice} ... avg buy at ${avgBuy} (${buyPrices.length} count)... trended ${trendDown}`);
    if (trendDown < -2.5) {
      const realtimeRunner = require('../realtime/RealtimeRunner');
      await realtimeRunner.handlePick({
        strategyName: 'avg-downer',
        ticker,
        keys: {
          [`${buyPrices.length}count`]: true,
          [this.getMinKey()]: true,
          isBeforeClose
        },
        data: { 
          trendDown,
          strategy
        }
      }, true);
    }

    this.scheduleTimeout();
  }
  shouldStop() {
    return Object.entries({
      notRunning: !this.running,
      hitEndAfter: this.timeout > END_AFTER,
      marketClosed: getMinutesFrom630() > 390
    }).filter(([reason, boolean]) => boolean).map(([ reason ]) => reason).shift();
  }
  stop() {
    this.running = false;
  }
  scheduleTimeout() {
    console.log(`observing again in ${this.timeout / 1000} seconds (${(new Date(Date.now() + this.timeout).toLocaleTimeString())})`)
    setTimeout(() => this.running && this.observe(), this.timeout);
    this.timeout *= 2;
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