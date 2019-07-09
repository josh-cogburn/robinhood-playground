const getCollections = require('./collections/get-collections');
const dayInProgress = require('./day-in-progress');
const getHistoricals = require('./historicals/get');

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

  async refreshCollections() {
    this.collections = await getCollections();
  }

  async collectionsAndHistoricals() {
    await this.timedAsync(
      'refreshing collections',
      () => this.refreshCollections(),
    );

    const allTickers = Object.values(this.collections).flatten().uniq();
    await this.timedAsync(
      `loading price caches with historical data for ${allTickers.length} tickers`,
      () => this.loadPriceCachesWithHistoricals(),
    );
  }

  async init() {

    if (this.hasInit) {
      return;
    }
    
    console.log('INITING REALTIME RUNNER');
    await this.collectionsAndHistoricals();    

    (await getStrategies()).forEach(strategy => {
      console.log(`init'd ${strategy.strategyName} REALTIME strategy!`);
      this.strategies.push(strategy);
    });

    const START_MIN = 5;
    regCronIncAfterSixThirty({
        name: 'RealtimeRunner: start',
        run: [START_MIN],
        fn: () => this.start()
    });

    regCronIncAfterSixThirty({
        name: 'RealtimeRunner: collectionsAndHistoricals',
        run: [2],
        fn: () => this.collectionsAndHistoricals()
    });

    regCronIncAfterSixThirty({
        name: 'RealtimeRunner: stop',
        run: [389],
        fn: () => this.stop()
    });

    if (dayInProgress(START_MIN)) {
      console.log('in progress');

      const last5Minute = this.getLastTimestamp(5);
      console.log({
        last5Minute,
        formatted: new Date(last5Minute).toLocaleString()
      })
      const diff = Date.now() - last5Minute;
      const from5 = (5 * 1000 * 60) - diff;
      console.log({
        diff: diff / 1000 / 60,
        from5: from5 / 1000 / 60
      });

      setTimeout(() => this.start(), from5);
    } else {
      console.log('not in progress ');
    }


    this.hasInit = true;
  }

  async loadPriceCachesWithHistoricals() {
    this.priceCaches = {};
    const allTickers = Object.values(this.collections).flatten().uniq();
    // const allStratPeriods = this.strategies.map(strategy => strategy.period).flatten().uniq();

    for (let period of [5, 10, 30]) {
      this.priceCaches = {
        ...this.priceCaches,
        [period]: await getHistoricals(allTickers, period)
      }
    }
    strlog({ allTickers, priceCaches: this.priceCaches });
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

  logLastTimestamps() {

    [5, 10, 30].forEach(period => {
      const curPriceCache = this.priceCaches[period];
      const firstTicker = Object.keys(curPriceCache)[0];
      const last5timestamps = curPriceCache[firstTicker]
        .slice(-5)
        .map(quote => new Date(quote.timestamp).toLocaleString());
    
      console.log(`${period}min period, last 5 timestamps...${last5timestamps}`);
      
    });
  }
  async addNewQuote(priceCachesToUpdate = Object.keys(this.priceCaches)) {
    
    console.log('getting new quotes...');
    this.logLastTimestamps();

    const allTickers = Object.values(this.collections).flatten().uniq();
    console.log({ allTickers })
    const relatedPrices = await lookupMultiple(
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


      this.logLastTimestamps();

    };

    priceCachesToUpdate.forEach(addToPriceCache);

    console.log('done fetching new quote data');
  }

  
  async timedAsync(eventString, asyncFn) {
    eventString = eventString.toUpperCase();
    const startTS = Date.now();
    console.log(`starting ${eventString}...`);
    const response = await asyncFn();
    const endTS = Date.now();
    console.log(`finished ${eventString}, time took to run: ${(endTS - startTS) / 1000}`);
    return response;
  }

  getLastTimestamp(period) {
    console.log('getting last timestamp');
    const relatedPriceCache = this.priceCaches[period];
    // console.log(Object.keys(relatedPriceCache));
    const firstTicker = Object.keys(relatedPriceCache)[0];
    const firstTickerData = relatedPriceCache[firstTicker];
    // console.log({
    //   period,
    //   firstTickerData: JSON.stringify(firstTickerData).slice(0, 20)
    // })
    const firstTickerLastHistorical = firstTickerData[firstTickerData.length - 1];
    if (!firstTickerLastHistorical) {
      console.log('WHAT NO LAST DATA', {
        period,
        firstTicker,
        relatedPriceCache
      })
    }
    return firstTickerLastHistorical.timestamp;
  }

  async everyFiveMinutes() {
    if (!this.currentlyRunning) {
      return this.stop();
    }
    
    this.runCount++;

    const lastTS = Object.keys(this.priceCaches).reduce((acc, period) => ({
      ...acc,
      [period]: this.getLastTimestamp(Number(period))
    }), {});
    console.log(lastTS)
    const periods = Object.keys(lastTS).filter(period => {
      const lastTimestamp = lastTS[period];
      const fromYesterday = lastTimestamp < Date.now() - 1000 * 60 * 60;
      const compareTS = fromYesterday ? (() => {
        const d = new Date();
        d.setHours(9, 30);
        return d.getTime();
      })() : lastTimestamp;
      
      const diff = Date.now() - compareTS;
      const shouldUpdate = diff > (period - 2) * 1000 * 60;
      console.log(
        'everyFiveMinutes REPORT', 
        this.runCount,
        {
          period,
          fromYesterday,
          compareTS: new Date(compareTS).toLocaleString(),
          shouldUpdate
        }
      );
      return shouldUpdate;
    }).map(Number);

    console.log('every five minutes...', { periods, runCount: this.runCount });

    await this.timedAsync(
      'adding new quote',
      () => this.addNewQuote(periods),
    );
    const picks = await this.timedAsync(
      'running all strategies',
      () => this.runAllStrategies(periods),
    );

    await this.timedAsync(
      `handling ${picks.length} picks`,
      () => this.handlePicks(picks),
    );

  }


  async runAllStrategies(periods = [5, 10, 30]) {
    
    const runAllStrategiesForPeriod = async period => {
      const picks = [];
      const relatedPriceCache = this.priceCaches[period];
      // strlog({
      //   period,
      //   relatedPriceCache
      // })
      const allTickers = Object.keys(relatedPriceCache);
      const withHandlers = this.strategies
        .filter(strategy => strategy.handler)
        .filter(strategy => !strategy.period || strategy.period.includes(period));
      for (let { strategyName, handler } of withHandlers) {
        console.log(`running ${strategyName} against ${period} minute data...`);
        for (let ticker of allTickers) {
          const allPrices = relatedPriceCache[ticker];
          const response = await handler({
            ticker,
            allPrices
          });
          if (response) {
            picks.push({
              ...response,
              ticker,
              period,
              strategyName,
              data: {
                ...response.data,
                allPrices,
              }
            });
          }
        }
      };
      return picks;
    };

    return (
      await mapLimit(periods, 1, runAllStrategiesForPeriod)
    ).flatten();

  }

  async runPostRunStrategies(picks) {
    const postRunStrategies = this.strategies.filter(strategy => strategy.postRun);
    const postRunPicks = await mapLimit(postRunStrategies, 1, async ({ strategyName, postRun }) => {
      console.log(`running ${strategyName} REALTIME POSTRUN strategy...`);
      return ((await postRun(
        picks,            // current picks
        this.todaysPicks  // array of array of past picks
      )) || []).map(pick => ({
        ...pick,
        strategyName
      }));
    });
    return [
      ...picks,
      ...postRunPicks.filter(Boolean).flatten()
    ];
  }

  async handlePicks(picks) {
    // run post run strategies
    const withPostRun = await this.runPostRunStrategies(picks);
    // mongo and socket updates
    for (let pick of withPostRun) {
      await this.handlePick(pick);
    }
    // add to todaysPicks
    this.todaysPicks.push(withPostRun); // array of arrays
  }

  async handlePick(pick) {

    const { ticker, keys, data, period, strategyName } = pick;
    console.log({
      ticker,
      keys,
      // data,
      period,
      strategyName
    });


    let [price] = this.priceCaches[5][ticker].slice(-1);
    price = price.currentPrice;

    const collectionKey = Object.keys(this.collections).find(collection => 
      (this.collections[collection] || []).includes(ticker)
    );
    const keyString = Object.keys(keys).filter(key => keys[key]).join('-');

    const periodKey = period && `${period}min`;
    const firstAlertkey = !this.todaysPicks.flatten().find(comparePick =>
      comparePick.ticker === ticker
        && comparePick.period === period
        && comparePick.strategyName === strategyName
    ) ? 'firstAlert' : '';

    const { shouldWatchout } = await getRisk({ ticker });
    const watchoutKey = shouldWatchout ? 'shouldWatchout' : 'notWatchout';
    const priceKeys = [2, 8, 20, 80, 300, 1000];
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
        fundamentals = (await addFundamentals([{ ticker }]))[0].fundamentals;
    } catch (e) {}
    const { volume, average_volume } = fundamentals || {};
    const volumeKey = (() => {
        if (volume > 1000000 || volume > average_volume * 3.5) return 'highVol';
        if (volume < 10000) return 'lowVol';
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
      // await sendEmail(`NEW ${strategyName.toUpperCase()} ALERT ${pickName}: ${ticker}`, JSON.stringify(pick, null, 2));
    }
    
    data.period = period;
    await recordPicks(pickName, 5000, [ticker], null, { keys, data });
  }



  getPms() {
    if (!this.hasInit) return {};
    
    return this.strategies.reduce((acc, { pms, strategyName }) => ({
      ...acc,
      ...Object.keys(pms || {}).reduce((inner, key) => ({
        ...inner,
        [`${strategyName}-${key}`]: [
          ...Array.isArray(pms[key]) ? pms[key] : [pms[key]],
          strategyName
        ]
      }), {
        [strategyName]: [strategyName]
      })
    }), {

      'multi-hits': ['multi-hits'],

      ...Object.keys(this.collections).reduce((acc, collectionName) => ({
        ...acc,
        [collectionName]: [collectionName]
      }), {})

    })
  }






})();