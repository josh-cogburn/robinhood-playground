const getCollections = require('./get-collections');
const dayInProgress = require('./day-in-progress');
const getHistoricals = require('./get-historicals');
const tiingoHistoricals = require('./tiingo-historicals');

// app-actions
const recordPicks = require('../app-actions/record-picks');

// rh-actions
const getRisk = require('../rh-actions/get-risk');

// utils
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const lookupMultiple = require('../utils/lookup-multiple');
const sendEmail = require('../utils/send-email');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const getStrategies = require('./get-strategies');

module.exports = new (class RealtimeRunner {
  

  constructor() {
    Object.assign(this, {
      hasInit: false,
      currentlyRunning: false,
      strategies: [],
      priceCaches: {},
      collections: null,
      fiveMinCountOnDay: 0,
      todaysPicks: []
    });
  }

  addStrategy(strategy, strategyName) {
    if (strategy && strategyName && strategy.handler && strategy.period) {
      this.strategies.push({
        ...strategy,
        strategyName
      });
    }
  }

  async refreshCollections() {
    this.collections = await getCollections();
  }

  async init() {

    if (this.hasInit) {
      return;
    }
    
    console.log('INITING REALTIME RUNNER');
    await this.refreshCollections();
    await this.refreshPriceCaches();
    (await getStrategies()).forEach(strategy => {
      if (strategy.handler && strategy.period) {
        this.strategies.push(strategy);
      }
    });

    regCronIncAfterSixThirty(Robinhood, {
        name: 'start RealtimeRunner',
        run: [5],
        fn: this.start
    });

    regCronIncAfterSixThirty(Robinhood, {
        name: 'stop RealtimeRunner',
        run: [631],
        fn: this.stop
    });

    if (dayInProgress()) {
      console.log('in progress');
      await this.start();
    } else {
      console.log('not in progress');
    }


    this.hasInit = true;
  }

  async refreshPriceCaches() {
    const allTickers = Object.values(this.collections).flatten().uniq();
    const allStratPeriods = this.strategies.map(strategy => strategy.period).flatten().uniq();

    const rhHistoricals = async (allTickers, period) => getHistoricals(Robinhood, allTickers, `${period}minute`);
    const historicalMethods = {
      5: rhHistoricals,
      10: rhHistoricals,
      30: tiingoHistoricals
    };

    for (let period of Object.keys(historicalMethods)) {
      this.priceCaches = {
        ...this.priceCaches,
        [period]: await historicalMethods[period](allTickers, period)
      }
    }
    // strlog({ allTickers, priceCaches: this.priceCaches });
  }

  async start() {
    this.currentlyRunning = true;
    this.fiveMinCountOnDay = 0;
    await this.lookupAndWaitPrices();
  }

  stop() {
    this.currentlyRunning = false;
  }


  async lookupAndWaitPrices() {
    if (!this.currentlyRunning) return;
    this.lookupRelatedPrices();
    setTimeout(() => this.lookupAndWaitPrices(), 5 * 1000 * 60);  // 5minute
  }

  async lookupRelatedPrices() {
    this.fiveMinCountOnDay++;
    
    const allTickers = Object.values(this.collections).flatten().uniq();

    const relatedPrices = await lookupMultiple(
        Robinhood,
        allTickers,
        true
    );


    const addToPriceCache = period => {
      const curPriceCache = this.priceCaches[period];
      Object.keys(relatedPrices).forEach(ticker => {
        if (curPriceCache[ticker]) {
          const curQuote = relatedPrices[ticker];
          curPriceCache[ticker].push(curQuote);
        } else {
          console.log('no price cache found for ', ticker, period);
        }
      });
      this.priceCaches[period] = curPriceCache;
    };


    // always update 5
    addToPriceCache(5);
    // sometimes update 10 and 30
    const sometimesUpdate = [10, 30];
    const shouldUpdate = sometimesUpdate.filter(period => 
      this.fiveMinCountOnDay % (period / 5) === 0
    );
    shouldUpdate.forEach(period => {
      console.log('updating ', period, 'because', this.fiveMinCountOnDay);
      addToPriceCache(period);
    });

    const runningPeriods = [
      5,
      ...shouldUpdate
    ];

    const runAllStrategies = async (ticker, period, strategies) => {
      const allPrices = this.priceCaches[period][ticker];
      if (!allPrices) {
        return console.log('no prices found for', {
          ticker, period, strategies
        })
      }
      
      for (let { strategyName, handler } of strategies) {
        const response = await handler({
          ticker,
          allPrices
        });
        if (response) {
          await this.handlePick(response, period, strategyName);
          this.todaysPicks.push({
            ticker,
            period,
            strategyName
          });
        }
      };
    }


    for (let period of runningPeriods) {
      const strategies = this.strategies.filter(strategy => strategy.period.includes(period));
      console.log(`running ${strategies.map(strategy => strategy.strategyName)}`);
      console.log({ strategies })
      for (let ticker of allTickers) {
        await runAllStrategies(
          ticker,
          period,
          strategies
        );
      }

    }

    console.log('RealtimeRunner: done getting related prices', allTickers.length);

  }



  async handlePick(pick, period, strategyName) {

    const { ticker, keys, data } = pick;
    let [price] = this.priceCaches[5][ticker].slice(-1);
    price = price.currentPrice;

    const collectionKey = Object.keys(this.collections).find(collection => 
      this.collections[collection].includes(ticker)
    );
    const keyString = Object.keys(keys).filter(key => keys[key]).join('-');

    const periodKey = `${period}min`;
    const firstAlertkey = !this.todaysPicks.find(pick =>
      pick.ticker === ticker
        && pick.period === period
        && pick.strategyName === strategyName
    ) ? 'firstAlert' : '';

    const { shouldWatchout } = await getRisk(Robinhood, { ticker });
    const watchoutKey = shouldWatchout ? 'shouldWatchout' : 'notWatchout';
    const priceKeys = [10, 15, 20, 1000];
    const priceKey = priceKeys.find(key => price < key);
    const min = getMinutesFrom630();
    const minKey = (() => {
        if (min > 390) return 'afterhours';
        if (min > 200) return 'dinner';
        if (min > 60) return 'lunch';
        if (min > 3) return 'brunch';
        if (min > 0) return 'initial';
        return 'premarket';
    })();
    let fundamentals;
    try {
        fundamentals = (await addFundamentals(Robinhood, [{ ticker }]))[0].fundamentals;
    } catch (e) {}
    const { volume, average_volume } = fundamentals || {};
    const volumeKey = (() => {
        if (volume > 1000000 || volume > average_volume * 3.5) return 'highVol';
        if (volume < 10000) return 'lowVol';
        return '';
    })();

    // const strategyName = `ticker-watchers-under${priceKey}${watchoutKey}${jumpKey}${minKey}${historicalKey}`;

    const pickName = [
        strategyName,
        collectionKey,
        periodKey,
        keyString,
        `under${priceKey}`,
        firstAlertkey,
        watchoutKey,
        minKey,
        volumeKey
    ].filter(Boolean).join('-');
    console.log({pickName});
    await sendEmail(`NEW ${strategyName.toUpperCase()} ALERT ${pickName}: ${ticker}`, JSON.stringify(pick, null, 2));
    
    strlog(recordPicks);
    strlog(require('../app-actions/record-picks'))
    await recordPicks(Robinhood, pickName, 5000, [ticker]);
  }



  getPms() {
    return this.strategies.reduce((acc, { pms, strategyName }) => ({
      ...acc,
      ...Object.keys(pms).reduce((inner, key) => ({
        ...inner,
        [`${strategyName}${key}`]: [
          ...Array.isArray(pms[key]) ? pms[key] : [pms[key]],
          strategyName
        ]
      }), {
        [strategyName]: [strategyName]
      })
    }), {})
  }






})();