const { mapObject } = require('underscore');

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
const getStSentiment = require('../utils/get-stocktwits-sentiment');

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


    // await this.timedAsync(
    //   'timing get st sent for all tickers',
    //   async () => {
    //     strlog((await mapLimit(allTickers, 3, async ticker => {
    //       const sent = await getStSentiment(ticker);
    //       console.log('huzzah', ticker, sent);
    //       return {
    //         ticker,
    //         ...sent
    //       };
    //     })).sort((a, b) => b.bullBearScore - a.bullBearScore));
    //     strlog((await mapLimit(allTickers, 3, async ticker => {
    //       const sent = await getStSentiment(ticker);
    //       console.log('huzzah', ticker, sent);
    //       return {
    //         ticker,
    //         ...sent
    //       };
    //     })).sort((a, b) => b.bullBearScore - a.bullBearScore));
    //   },
    // );
    
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
    strlog({ 
      allTickers, 
      priceCaches: mapObject(
        this.priceCaches, 
        priceCache => mapObject(priceCache, historicals => historicals.length)
      )
    });
  }

  async start() {
    console.log('start!!');
    this.currentlyRunning = true;
    this.runCount = 0;
    this.interval = setInterval(() => 
      this.timedAsync(
        'every five minutes timerrrr',
        () => this.everyFiveMinutes(),
      ),
      5 * 1000 * 60 // 5 minutes
    );
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
    // console.log({ allTickers })
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
      () => this.handlePicks(picks, periods),
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

  async runPostRunStrategies(picks, periods) {
    const postRunStrategies = this.strategies.filter(strategy => strategy.postRun);
    const postRunPicks = await mapLimit(postRunStrategies, 1, async ({ strategyName, postRun }) => {
      console.log(`running ${strategyName} REALTIME POSTRUN strategy...`);
      return ((await postRun(
        picks,              // current picks
        this.todaysPicks,   // array of array of past picks,
        periods             // array of periods that were run
      )) || []).map(pick => ({
        ...pick,
        strategyName
      }));
    });
    return postRunPicks.filter(Boolean).flatten();
  }

  async prefetchStSent(picks) {
    const allTickers = picks.map(pick => pick.ticker).uniq();
    // console.log({allTickers});
    const prefetch = (await mapLimit(allTickers, 3, async ticker => {
      const sent = await getStSentiment(ticker);
      // console.log('huzzah', ticker, sent);
      return {
        ticker,
        ...sent
      };
    }));
    console.log({
      allTickers: allTickers.length,
      stSentPrefetch: prefetch.length
    })
  }

  async handlePicks(picks, periods) {

    // prefetch st sent for all picks
    await this.prefetchStSent(picks);

    // mongo and socket updates
    // for PICKS
    for (let pick of picks) {
      pick._id = await this.handlePick(pick);
    }

    // run post run strategies
    const postRunPicks = await this.runPostRunStrategies(picks, periods);
    console.log(`total post run picks: ${postRunPicks.length}`)
    
    // mongo and socket updates
    // for POSTRUNPICKS
    for (let pick of postRunPicks) {
      await this.handlePick(pick);
    }

    // add to todaysPicks
    this.todaysPicks.push([
      ...picks,
      ...postRunPicks
    ]); // array of arrays
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


    let [price] = (this.priceCaches[5][ticker] || []).slice(-1);
    price = (price || {}).currentPrice;

    const collectionKey = Object.keys(this.collections).find(collection => 
      (this.collections[collection] || []).includes(ticker)
    );
    const keyString = Object.keys(keys || {}).filter(key => keys[key]).join('-');

    const periodKey = period && `${period}min`;
    const firstAlertkey = !this.todaysPicks.flatten().find(comparePick =>
      comparePick.ticker === ticker
        && comparePick.period === period
        && comparePick.strategyName === strategyName
    ) ? 'firstAlert' : '';

    const { shouldWatchout } = await getRisk({ ticker });
    const watchoutKey = shouldWatchout ? 'shouldWatchout' : 'notWatchout';
    const priceKeys = [2, 8, 20, 80, 300, 1000, 5000];
    const priceKey = priceKeys.find(key => price < key);
    const min = getMinutesFrom630();
    const minKey = (() => {
        if (min > 390) return 'afterhours';
        if (min > 200) return 'dinner';
        if (min > 90) return 'lunch';
        if (min > 35) return 'brunch';
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
    data.stSent = await getStSentiment(ticker);
    return recordPicks(pickName, 5000, [ticker], null, { keys, data });
  }



  getPms() {
    if (!this.hasInit) return {};
    
    const singles = [
      ...[
        'initial',
        'brunch',
        'lunch',
        'dinner'
      ],
      ...[5, 10, 30],
      ...Object.keys(this.collections)
    ];

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

      ...singles.reduce((acc, collectionName) => ({
        ...acc,
        [collectionName]: [collectionName]
      }), {})

    })
  }






})();