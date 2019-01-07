
const jsonMgr = require('../utils/json-mgr');
const { CronJob } = require('cron');
const fs = require('mz/fs');

// mongo
const Pick = require('../models/Pick');

// predictions and past data
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const createPredictionModels = require('./create-prediction-models');

const getTrend = require('../utils/get-trend');
const { avgArray } = require('../utils/array-math');
const sendEmail = require('../utils/send-email');
const getSettingsString = require('../utils/get-settings-string');

const marketClosures = require('../market-closures');

const formatDate = date => date.toLocaleDateString().split('/').join('-');
const getToday = () => formatDate(new Date());

const flatten = require('../utils/flatten-array');
const TickerWatcher = require('./ticker-watcher');

const stratManager = {
    Robinhood: null,
    io: null,
    picks: [],
    tickersOfInterest: [],
    // relatedPrices: {},
    curDate: null,
    predictionModels: {},
    hasInit: false,
    tickerWatcher: null,    // TickerWatcher instance
    settingsString: null,
    
    async init({ io, dateOverride } = {}) {
        if (this.hasInit) return;
        this.Robinhood = global.Robinhood;
        this.io = io;
        this.tickerWatcher = new TickerWatcher({
            name: 'stratManager', 
            Robinhood: this.Robinhood, 
            handler: relatedPrices => {
                this.sendToAll('server:related-prices', relatedPrices);
            }
        });

        // init picks?
        console.log('init refresh')
        try {
            await this.refreshPastData();
        } catch (e) {
            console.log('error refreshing past', e);
        }
        console.log('init picks')
        await this.initPicksAndPMs(dateOverride);
        console.log('get prices');
        await this.tickerWatcher.start();
        // console.log('send report init')
        // try {
            // await this.sendPMReport();
        // } catch (e) {
        //     console.log('error sending report', e);
        // }
        console.log('initd strat manager');

        new CronJob(`40 7 * * 1-5`, () => this.newDay(), null, true);

        this.settingsString = await getSettingsString();
        this.hasInit = true;
    },
    getWelcomeData() {
        return {
            curDate: this.curDate,
            picks: this.picks,
            relatedPrices: this.tickerWatcher.relatedPrices,
            pastData: this.pastData,
            predictionModels: this.predictionModels,
            settingsString: this.settingsString
        };
    },
    newPick(data) {
        this.tickerWatcher.addTickers(data.withPrices.map(o => o.ticker));
        // console.log('new pick', data);
        // if (this.curDate !== getToday()) {
        //     return;
        // }
        this.picks.push(data);
        this.sendToAll('server:picks-data', data);
    },
    getAllPicks() {
        return this.picks;
    },
    sendToAll(eventName, data) {
        // console.log('sending to all', eventName, data);
        this.io && this.io.emit(eventName, data);
    },
    async newDay() {
        console.log('NEW DAY')
        await this.tickerWatcher.lookupRelatedPrices();
        try {
            await this.sendPMReport();
        } catch (e) {
            console.log('error sending report', e);
        }
        await this.refreshPastData();
        this.picks = [];
        this.tickerWatcher.clearTickers();
        await this.initPicksAndPMs();
        await this.tickerWatcher.lookupRelatedPrices();
        this.sendToAll('server:welcome', this.getWelcomeData());
    },
    async determineCurrentDay() {
        // calc current date
        const now = new Date();
        const compareDate = new Date();
        compareDate.setHours(7);
        compareDate.setMinutes(40);
        if (compareDate - now > 0) {
            now.setDate(now.getDate() - 1);
        }
        const day = now.getDay();
        const isWeekday = day >= 1 && day <= 5;
        let dateStr = formatDate(now);

        console.log({ day, isWeekday, dateStr });

        if (!isWeekday || marketClosures.includes(dateStr)) {
            // from most recent day (weekend will get friday)
            let pms = await fs.readdir('./json/prediction-models');
            let sortedFiles = pms
                .map(f => f.split('.')[0])
                .sort((a, b) => new Date(b) - new Date(a));
            console.log( sortedFiles[0],'0' )
            dateStr = sortedFiles[0];
        }
        return dateStr;
    },
    async initPicksAndPMs(dateOverride) {
        const dateStr = dateOverride || await this.determineCurrentDay();
        const hasPicksData = (await Pick.countDocuments({ date: dateStr })) > 0;
        console.log('hasPicksData', hasPicksData);
        if (hasPicksData) {
            await this.initPicks(dateStr);
        }
        this.curDate = dateStr;
        console.log('cur date now', this.curDate);
        await this.refreshPredictionModels();
    },
    async initPicks(dateStr) {
        console.log('init picks', dateStr)
        const dbPicks = await Pick.find({ date: dateStr });
        console.log('dbPicks', dbPicks);
        const picks = dbPicks.map(pick => ({
            stratMin: `${pick.strategyName}-${pick.min}`,
            withPrices: pick.picks
        }));

        console.log('numPicks', picks.length);

        console.log('mostRecentDay', dateStr);
        this.curDate = dateStr;

        const tickersOfInterest = flatten(
            picks.map(pick =>
                pick.withPrices.map(tickerObj => tickerObj.ticker)
            )
        );

        const uniqTickers = [...new Set(tickersOfInterest)];

        console.log('numUniqTickersOfInterest', uniqTickers.length)

        this.tickerWatcher.clearTickers();
        this.tickerWatcher.addTickers(uniqTickers);
        
        this.picks = picks;

        
    },
    calcPmPerfs() {
        const {relatedPrices} = this.tickerWatcher;
        console.log({ relatedPrices });
        
        return Object.entries(this.predictionModels).map(entry => {
            const [ stratName, trends ] = entry;
            // const trends = this.predictionModels[stratName];
            console.log(entry);
            let foundStrategies = trends
                .map(stratMin => {
                    const foundStrategy = this.picks.find(pick => pick.stratMin === stratMin);
                    if (!foundStrategy) return null;
                    const { withPrices } = foundStrategy;
                    if (typeof withPrices[0] === 'string') {
                        console.log(`typeof withPrices[0] === 'string'`, {withPrices});
                        return;
                    }
                    const withTrend = withPrices.map(stratObj => {
                        const relPrices = relatedPrices[stratObj.ticker];
                        if (!relPrices) {
                            console.log('OH NO DAWG', stratObj.ticker, stratObj);
                            return {};
                        }
                        // console.log('relPrices', relPrices, { stratObj });
                        const { lastTradePrice, afterHoursPrice } = relPrices;
                        const nowPrice = lastTradePrice;    // afterHoursPrice ||
                        // console.log('nowPrice', nowPrice)
                        return {
                            ticker: stratObj.ticker,
                            thenPrice: stratObj.price,
                            nowPrice,
                            trend: getTrend(nowPrice, stratObj.price)
                        };
                    });
                    return {
                        avgTrend: avgArray(withTrend.map(obj => obj.trend)),
                        stratMin
                    };
                });
            
            foundStrategies = foundStrategies.filter(Boolean);
            const stratOrder = foundStrategies.map(t => t.stratMin);
            const withoutDuplicates = [];
            foundStrategies.forEach((stratObj, i) => {
                const { stratMin } = stratObj;
                // console.log({stratOrder, stratMin });
                if (stratOrder.findIndex(s => s === stratMin) === i) {
                    withoutDuplicates.push(stratObj)
                }
            });
            
            // console.log({ stratOrder, withoutDuplicates });
            return {
                pmName: stratName,
                weightedTrend: avgArray(foundStrategies.map(obj => obj.avgTrend)),
                avgTrend: avgArray(withoutDuplicates.map(obj => obj.avgTrend))
            };
        })
            .filter(t => !!t.avgTrend)
            .sort((a, b) => Number(b.avgTrend) - Number(a.avgTrend));

    },
    async sendPMReport() {
        console.log('sending pm report');
        // console.log('STRATS HERE', this.predictionModels);
        const pmPerfs = this.calcPmPerfs();
        const emailFormatted = pmPerfs
            .map(pm => `${pm.avgTrend.toFixed(2)}% ${pm.pmName}`)
            .join('\n');
        await sendEmail(`robinhood-playground: 24hr report for ${this.curDate}`, emailFormatted);
        await jsonMgr.save(`./json/pm-perfs/${this.curDate}.json`, pmPerfs);
        console.log('sent and saved pm report');
    },
    async createAndSaveNewPredictionModels(todayPMpath) {
        console.log('creating new prediction models');
        const newPMs = await createPredictionModels(this.Robinhood);
        console.log('saving to', todayPMpath);
        await jsonMgr.save(todayPMpath, newPMs);
        return newPMs;
    },
    async refreshPredictionModels() {
        console.log('refreshing prediction models');
        // set predictionmodels
        const todayPMpath = `./json/prediction-models/${this.curDate}.json`;
        try {
            var foundDayPMs = await jsonMgr.get(todayPMpath);
        } catch (e) { }
        // console.log('found pms', foundDayPMs);
        this.predictionModels = foundDayPMs ? foundDayPMs : await this.createAndSaveNewPredictionModels(todayPMpath);
    },
    async refreshPastData() {
        console.log('refreshing past data');
        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        await this.setPastData(stratPerfData);
    },
    async setPastData(stratPerfData) {
        const stratPerfObj = {};
        stratPerfData.sortedByAvgTrend.forEach(({
            name,
            avgTrend,
            count,
            percUp
        }) => {
            stratPerfObj[name] = {
                avgTrend,
                percUp,
                count
            };
        });
        this.pastData = {
            fiveDay: stratPerfObj
        };
    }
};

module.exports = stratManager;
