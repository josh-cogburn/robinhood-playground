const Combinatorics = require('js-combinatorics');
const { mapObject } = require('underscore');

const getCollections = require('./collections/get-collections');
const dayInProgress = require('./day-in-progress');
const getHistoricals = require('./historicals/get');
const daily = require('./historicals/daily');

// app-actions
const recordPicks = require('../app-actions/record-picks');
const runAllPennyScans = require('./run-all-penny-scans');
const sendRecs = require('../app-actions/send-recs');
const restartProcess = require('../app-actions/restart-process');

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
  

  constructor(disabled = false) {
    Object.assign(this, {
      hasInit: false,
      currentlyRunning: false,
      strategies: [],
      priceCaches: {},
      collections: {},
      runCount: 0,
      todaysPicks: [],
      interval: null,
      disabled,
    });
  }

  async refreshCollections() {
    this.collections = await getCollections();
  }

  getAllTickers() {
    return Object.values(this.collections).flatten().uniq();
  }

  async collectionsAndHistoricals() {
    await this.timedAsync(
      'refreshing collections',
      () => this.refreshCollections(),
    );

    const allTickers = this.getAllTickers();


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

  async init(disabled) {

    if (this.hasInit) {
      return;
    }
    
    (await getStrategies()).forEach(strategy => {
      console.log(`init'd ${strategy.strategyName} REALTIME strategy!`);
      this.strategies.push(strategy);
    });


    if (disabled) {
      this.hasInit = true;
      return console.log('nope DISABLED');
    }

    console.log('INITING REALTIME RUNNER');
    await this.collectionsAndHistoricals();    

    const START_MIN = 5;
    regCronIncAfterSixThirty({
        name: 'RealtimeRunner: start',
        run: [START_MIN],
        fn: () => this.start()
    });

    regCronIncAfterSixThirty({
        name: 'RealtimeRunner: SPECIAL PRE MARKET SPECIAL',
        run: [-60, -45, -30, -20, -10, 3, 395],
        fn: () => this.topOfHour()
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
        [period]: await getHistoricals(allTickers, period, 14)
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
    this.intervals = [
      setInterval(() => 
        this.timedAsync(
          'every five minutes timerrrr',
          () => this.everyFiveMinutes(),
        ),
        5 * 1000 * 60 // 5 minutes
      ),

      setInterval(() => 
        this.timedAsync(
          'every 3 hours (daily)',
          () => this.runDaily(),
        ),
        60 * 1000 * 60 * 3 // 3 hours
      ),
    ];

    this.everyFiveMinutes();
  }

  stop() {
    this.currentlyRunning = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
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
      sendEmail('NO LAST DATA', `no last data ${period}`);
      console.log('WHAT NO LAST DATA', {
        period,
        firstTicker,
        relatedPriceCache
      });
      restartProcess();
    }
    return (firstTickerLastHistorical || {}).timestamp;
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
    
    console.log(lastTS);

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


    // once and hour check?
    const min = (new Date()).getMinutes();
    const topOfHour = Boolean(min < 4);
    if (topOfHour) {
      await this.topOfHour();
    }

  }

  async topOfHour() {

    const nowStr = (new Date()).toLocaleString();

    await this.timedAsync(
      `ONCE AN HOUR ${nowStr}`,
      async () => {
        console.log('RUNNING DAILY', nowStr);
        await this.runDaily();
    
        console.log('COLLECTIONS AND HISTORICALS JUST BECAUSE', nowStr);
        await this.collectionsAndHistoricals();
    
        console.log('RUNNING PENNIES', nowStr);
        await this.runPennies();
    
        console.log('SENDING RECS');
        await sendRecs();
      }
    );
    
    
  }

  async runPennies(skipSave = false) {
    const picks = await runAllPennyScans();

    if (!skipSave) {
      for (let pick of picks) {
        strlog({ pick })
        pick._id = await this.handlePick(pick);
      }
    }

    await sendEmail(
      'PENNY SCAN', 
      JSON.stringify(
        picks.map(pick => ({
          strategyName: pick.strategyName,
          ticker: pick.ticker,
          data: pick.data,
        })), 
        null,
        2
      )
    );
    
    return picks;
  }

  async runDaily(skipSave = false, runAll) {

    console.log('RUNNING DAILY');
    const dip = dayInProgress();
    const allTickers = this.getAllTickers();
    console.log({ dip, allTickers });
    const tickersAndAllPrices = await daily({
      tickers: allTickers,
      includeCurrentPrice: dip
    });
    const withHandlers = this.strategies
        .filter(strategy => strategy.handler)
        .filter(strategy => runAll || (strategy.period && strategy.period.includes('d')));
    strlog({ withHandlers });
    let picks = [];
    for (let strategy of withHandlers) {

      picks = [
        ...picks,
        ...await this.runSingleStrategy(
          tickersAndAllPrices,
          strategy,
          'd'
        )
      ];
        
    }

    console.log('daily picks count: ', picks.length);

    if (!skipSave) {
      for (let pick of picks) {
        strlog({ pick })
        pick._id = await this.handlePick(pick);
      }
    }


    await sendEmail(
      'DAILY', 
      JSON.stringify(
        picks.map(pick => ({
          strategyName: pick.strategyName,
          ticker: pick.ticker,
          keys: Object.keys(pick.keys).filter(key => pick.keys[key])
        })), 
        null, 
        2
      )
    );
    return picks;

  }

  async runSingleStrategy(tickersAndAllPrices, strategy, period) {
    const picks = [];
    const { strategyName, handler, collections } = strategy;
    const filteredByCollections = collections && collections.length ? 
      tickersAndAllPrices.filter(({ ticker }) => {
        return collections.some(collection => {
          return this.collections[collection].includes(ticker);
        });
      }) : tickersAndAllPrices;
    strlog({
      strategyName,
      tickersAndAllPrices: tickersAndAllPrices.length,
      filteredByCollections: filteredByCollections.length
    });
    console.log(`running ${strategyName} against ${period} minute data...`);
    for (let { ticker, allPrices } of filteredByCollections) {
      const response = await handler({
        ticker,
        allPrices
      });
      if (response && Object.keys(response.keys || {}).filter(key => !!response.keys[key]).length) {
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
    return picks;
  }

  async runAllStrategies(periods = [5, 10, 30], runAll) {
    console.log('run all strategies', periods)
    const runAllStrategiesForPeriod = async period => {
      let picks = [];
      const relatedPriceCache = this.priceCaches[period];
      // strlog({
      //   period,
      //   relatedPriceCache
      // })
      const allTickers = Object.keys(relatedPriceCache);
      const withHandlers = this.strategies
        .filter(strategy => strategy.handler)
        .filter(strategy => runAll || (!strategy.period || strategy.period.includes(period)));
      for (let strategy of withHandlers) {
        picks = [
          ...picks,

          ...await this.runSingleStrategy(

            // tickersAndAllPrices
            allTickers.map(ticker => ({
              ticker,
              allPrices: relatedPriceCache[ticker]
            })),
            strategy,
            period

          )
        ];
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

  async handlePick(pick, minimalist) {

    let { ticker, keys, data, period, strategyName } = pick;

    console.log({
      ticker,
      keys,
      // data,
      period,
      strategyName
    });

    if (!ticker) {
      console.log('no ticker backing out');
      return null;
    }



    const collectionKey = !strategyName.includes('pennyscan') ? Object.keys(this.collections).find(collection => 
      (this.collections[collection] || []).includes(ticker)
    ) : undefined;
    const keyString = Object.keys(keys || {}).filter(key => keys[key]).join('-');

    const periodKey = (() => {
      if (period === 'd') return 'daily';
      if (period) return `${period}min`;
    })();


    
    let [price] = data && data.allPrices 
      ? data.allPrices.slice(-1)
      : (this.priceCaches[5][ticker] || []).slice(-1);
    price = (price || {}).currentPrice;
    const priceKeys = [2, 8, 20, 80, 300, 1000, 5000];
    const priceKey = priceKeys.find(key => price < key);
    const min = getMinutesFrom630();
    const minKey = (() => {
        if (min > 390) return 'afterhours';
        if (min > 200) return 'dinner';
        if (min > 120) return 'lunch';
        if (min > 45) return 'brunch';
        if (min > 0) return 'initial';
        return 'premarket';
    })();

    if (strategyName === 'sudden-drops' && min < 11) {
      strategyName = 'overnight-drops';
    }

    

    const firstAlertkey = !this.todaysPicks.flatten().find(comparePick =>
      comparePick.ticker === ticker
        && comparePick.period === period
        && comparePick.strategyName === strategyName
    ) ? 'firstAlert' : '';


    let volumeKey, watchoutKey, stSent;

    if (!minimalist) {

      // volumeKey
      let fundamentals;
      try {
          fundamentals = (await addFundamentals([{ ticker }]))[0].fundamentals;
      } catch (e) {}
      const { volume, average_volume } = fundamentals || {};
      volumeKey = (() => {
          if (volume > 1000000 || volume > average_volume * 3.5) return 'highVol';
          if (volume < 10000) return 'lowVol';
      })();
  
      // watchoutKey
      const { shouldWatchout } = await getRisk({ ticker });
      watchoutKey = shouldWatchout ? 'shouldWatchout' : 'notWatchout';

      // stSent
      stSent = await getStSentiment(ticker)
    }


    // const strategyName = `ticker-watchers-under${priceKey}${watchoutKey}${jumpKey}${minKey}${historicalKey}`;

    const pickName = [
        strategyName,
        collectionKey,
        periodKey,
        keyString,
        priceKey && `under${priceKey}`,
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
    
    data = {
      ...data,
      period,
      stSent
    };
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
      ...[5, 10, 30 , 'daily'],
      ...Object.keys(this.collections),
      
      'volume-increasing',
      'pennyscan-highHit',
      ...[30, 90, 120, 360].map(period => `pennyscan-highHit${period}`),
      

    ];

    const mustIncludeAll = this.strategies.reduce((acc, { pms, strategyName }) => ({
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

      ...Combinatorics.cartesianProduct(
        [
          'notWatchout',
          'shouldWatchout',
        ],
        [
          'majorJump',
          'minorJump',
          'mediumJump'
        ]
      ).toArray().reduce((acc, arr) => {

        return {
          ...acc,
          ...Combinatorics.power(arr)
            .toArray()
            .filter(s => s && s.length)
            .reduce((inner, combo) => {

              combo = [
                'overnight-drops',
                ...combo
              ];
              return {
                ...inner,
                [combo.join('-')]: combo
              };
              
            }, {})
        }

      }, {}),



      ...singles.reduce((acc, collectionName) => ({
        ...acc,
        [collectionName]: [collectionName]
      }), {}),

      ...[1, 2, 3, 4].reduce((acc, streak) => ({
        ...acc,
        [`pennyscan-highHit-streak${streak}`]: ['highHit', `streak${streak}`]
      }), {}),

      ...Combinatorics.cartesianProduct(
        [
          'nowheres',
          'hot-st',
          'droppers',
          'unfiltered'
        ],
        [
          'singleTopVolumeSS',
          'singlePercMaxVolSS',
          'ss180',
          'ssFirstTwo',
          'stTrendRatioFirst3',
          'worstSsTrendRatio',
          'worstSS',
    
          ...`
            projectedVolume
            dollarVolume
            highestTrend
            
            zScoreVolume
            zScoreInverseTrend
            zScoreInverseTrendMinusRSI
            zScoreInverseTrendPlusVol
            zScoreHighSentLowRSI
            zScoreMagic
            zScoreHotAndCool
            zScoreGoingBadLookingGood
          `
              .split('\n')
              .map(t => t.trim())
              .filter(Boolean)

        ],
        [
          'initial',
          'brunch',
          'lunch',
          'dinner'
        ]
      ).toArray().reduce((acc, arr) => ({
        ...acc,
        [`pennyscan-${arr.join('-')}`]: ['pennyscan', ...arr],
        [`pennyscan-${arr.slice(0, 2).join('-')}`]: ['pennyscan', ...arr.slice(0, 2)]
      }), {}),

      nowheresTopSSPREMARKET: ['nowheres', 'topSS', 'premarket'],


      ...Combinatorics.cartesianProduct(
        [
          ...[1, 5, 10, 30, 60, 120].map(n => `under${n}min`),
          'gt120min'
        ],
        [
          ...Array(5).fill(1).map((v, i) => ++i).map(n => `${n}count`)
        ]
      ).toArray().reduce((acc, arr) => {

        return {
          ...acc,
          ...Combinatorics.power(arr)
            .toArray()
            .filter(s => s && s.length)
            .reduce((inner, combo) => {

              combo = [
                'avg-downer',
                ...combo
              ];
              return {
                ...inner,
                [combo.join('-')]: combo
              };
              
            }, {})
        }

      }, {})

      

    });

    // strlog({ mustIncludeAll });

    return {
      ...mapObject(mustIncludeAll, arr => [arr]),
      ...require('../pms/sep-2019'),
    };
  }






})();