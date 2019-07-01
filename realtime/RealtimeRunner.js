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

const pmsHit = require('../utils/pms-hit');

module.exports = new (class RealtimeRunner {
  

  constructor() {
    Object.assign(this, {
      hasInit: false,
      currentlyRunning: false,
      strategies: [],
      priceCaches: {},
      collections: null,
      runCount: 0,
      todaysPicks: [],
      interval: null
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
    await this.timedAsync(
      () => this.refreshCollections(),
      'refreshing collections'
    );

    const allTickers = Object.values(this.collections).flatten().uniq();
    await this.timedAsync(
      () => this.loadPriceCachesWithHistoricals(),
      `loading price caches with historical data for ${allTickers.length} tickers`
    );

    (await getStrategies()).forEach(strategy => {
      if (strategy.handler && strategy.period) {
        this.strategies.push(strategy);
      }
    });

    regCronIncAfterSixThirty(Robinhood, {
        name: 'start RealtimeRunner',
        run: [5],
        fn: () => this.start()
    });

    regCronIncAfterSixThirty(Robinhood, {
        name: 'stop RealtimeRunner',
        run: [631],
        fn: () => this.stop()
    });

    if (dayInProgress()) {
      console.log('in progress');
      await this.start();
    } else {
      console.log('not in progress');
    }


    this.hasInit = true;
  }

  async loadPriceCachesWithHistoricals() {
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
    console.log('start!!');
    this.currentlyRunning = true;
    this.runCount = 0;
    this.interval = setInterval(() => this.everyFiveMinutes(), 5 * 1000 * 60);  // 5minute
    this.everyFiveMinutes();
  }

  stop() {
    this.currentlyRunning = false;
    clearInterval(this.interval);
    this.interval = null;
  }

  async addNewQuote(priceCachesToUpdate = Object.keys(this.priceCaches)) {
    
    console.log('getting new quotes...');
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
          curPriceCache[ticker].push({
            timestamp: Date.now(),
            ...curQuote
          });
        } else {
          console.log('no price cache found for ', ticker, period);
        }
      });
      this.priceCaches[period] = curPriceCache;

      const last5timestamps = curPriceCache[allTickers[0]]
        .slice(-5)
        .map(quote => new Date(quote.timestamp).toLocaleString());

      console.log(`${period}min period, last 5 timestamps...${last5timestamps}`);
    };

    priceCachesToUpdate.forEach(addToPriceCache);

    console.log('done fetching new quote data');
  }

  
  async timedAsync(asyncFn, eventString) {
    eventString = eventString.toUpperCase();
    const startTS = Date.now();
    console.log(`starting ${eventString}...`);
    const response = await asyncFn();
    const endTS = Date.now();
    console.log(`finished ${eventString}, time took to run: ${(endTS - startTS) / 1000}`);
    return response;
  }

  async everyFiveMinutes() {
    if (!this.currentlyRunning) {
      return this.stop();
    }
    
    this.runCount++;
    const periods = [
      5,
      ...[10, 30].filter(period => 
        this.runCount % (period / 5) === 0
      )
    ];

    console.log('every five minutes...', { periods, runCount: this.runCount });

    await this.timedAsync(
      () => this.addNewQuote(periods),
      'adding new quote'
    );
    const picks = await this.timedAsync(
      () => this.runAllStrategies(periods),
      'running all strategies'
    );

    await this.timedAsync(
      () => this.handlePicks(picks),
      `handling ${picks.length} picks`
    );

  }


  async runAllStrategies(periods = [5, 10, 30]) {
    
    const picks = [];

    const runAllStrategiesForPeriod = async period => {

      const relatedPriceCache = this.priceCaches[period];

      // strlog({
      //   period,
      //   relatedPriceCache
      // })
      const allTickers = Object.keys(relatedPriceCache);
      
      for (let { strategyName, handler } of this.strategies) {
        console.log(`running ${strategyName} against ${period} minute data...`);
        for (let ticker of allTickers) {
          const response = await handler({
            ticker,
            allPrices: relatedPriceCache[ticker]
          });
          if (response) {
            picks.push({
              ...response,
              period,
              strategyName,
            });
          }
        }

      };
      
    };
  
    for (let period of periods) {
      await runAllStrategiesForPeriod(period);
    }

    return picks;
  }

  async handlePicks(picks) {

    const uniqTickers = picks.map(pick => pick.ticker).uniq();
    const tickersToStratHits = uniqTickers.reduce((acc, ticker) => ({
      ...acc,
      [ticker]: picks
        .filter(pick => pick.ticker === ticker)
        .map(pick => pick.strategyName)
        .uniq()
    }), {});

    const multiHitTickers = Object.keys(tickersToStratHits).filter(ticker => 
      tickersToStratHits[ticker].length > 1
    );

    multiHitTickers.forEach(ticker => {
      picks.push({
        ticker,
        keys: {
          [tickersToStratHits[ticker].length]: true,
        },
        strategyName: 'multi-hits'
      })
    });

    

    for (let pick of picks) {
      await this.handlePick(pick);
    }
  }

  async handlePick(pick) {

    const { ticker, keys, data, period, strategyName } = pick;
    console.log({
      ticker,
      keys,
      // data,
      period,
      strategyName
    })
    this.todaysPicks.push({
      ticker,
      period,
      strategyName
    });


    let [price] = this.priceCaches[5][ticker].slice(-1);
    price = price.currentPrice;

    const collectionKey = Object.keys(this.collections).find(collection => 
      this.collections[collection].includes(ticker)
    );
    const keyString = Object.keys(keys).filter(key => keys[key]).join('-');

    const periodKey = period && `${period}min`;
    const firstAlertkey = !this.todaysPicks.find(comparePick =>
      comparePick.ticker === ticker
        && comparePick.period === period
        && comparePick.strategyName === strategyName
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

    const pms = await pmsHit(null, pickName);
    if (pms && pms.length && pms.includes('forPurchase')) {
      await sendEmail(`NEW ${strategyName.toUpperCase()} ALERT ${pickName}: ${ticker}`, JSON.stringify(pick, null, 2));
    }
    
    await recordPicks(Robinhood, pickName, 5000, [ticker]);
  }



  getPms() {
    return this.strategies.reduce((acc, { pms, strategyName }) => ({
      ...acc,
      ...Object.keys(pms).reduce((inner, key) => ({
        ...inner,
        [`${strategyName}-${key}`]: [
          ...Array.isArray(pms[key]) ? pms[key] : [pms[key]],
          strategyName
        ]
      }), {
        [strategyName]: [strategyName]
      })
    }), {
      'multi-hits': ['multi-hits']
    })
  }






})();