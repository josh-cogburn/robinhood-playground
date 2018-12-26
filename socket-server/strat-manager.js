const { lookupTickers } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const { CronJob } = require('cron');
const fs = require('mz/fs');

// mongo
const Pick = require('../models/Pick');

// predictions and past data
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const { predictCurrent, stratPerfPredictions } = require('../app-actions/predict-top-performing');
const createPredictionModels = require('./create-prediction-models');

const getTrend = require('../utils/get-trend');
const { avgArray } = require('../utils/array-math');
const sendEmail = require('../utils/send-email');

const formatDate = date => date.toLocaleDateString().split('/').join('-');
const getToday = () => formatDate(new Date());

const flatten = require('../utils/flatten-array');

const stratManager = {
    Robinhood: null,
    io: null,
    picks: [],
    tickersOfInterest: [],
    relatedPrices: {},
    curDate: null,
    predictionModels: {},
    hasInit: false,

    async init(io) {
        if (this.hasInit) return;
        this.Robinhood = global.Robinhood;
        this.io = io;

        // init picks?
        console.log('init refresh')
        try {
            await this.refreshPastData();
        } catch (e) {
            console.log('error refreshing past', e);
        }
        console.log('init picks')
        await this.initPicksAndPMs();
        console.log('get prices')
        await this.getAndWaitPrices();
        // console.log('send report init')
        // try {
        //     await this.sendPMReport();
        // } catch (e) {
        //     console.log('error sending report', e);
        // }
        console.log('initd strat manager');

        new CronJob(`40 7 * * 1-5`, () => this.newDay(), null, true);
        this.hasInit = true;
    },
    getWelcomeData() {
        return {
            curDate: this.curDate,
            picks: this.picks,
            relatedPrices: this.relatedPrices,
            pastData: this.pastData,
            predictionModels: this.predictionModels
        };
    },
    newPick(data) {

        const { withPrices } = data;
        withPrices.forEach(({ ticker, price }) => {
            if (!this.tickersOfInterest.includes(ticker)) {
                this.tickersOfInterest.push(ticker);
            }
        });

        // console.log('new pick', data);
        if (this.curDate !== getToday()) {
            return;
        }
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
        await this.getRelatedPrices();
        try {
            await this.sendPMReport();
        } catch (e) {
            console.log('error sending report', e);
        }
        await this.refreshPastData();
        this.picks = [];
        this.tickersOfInterest = [];
        await this.initPicksAndPMs();
        await this.getRelatedPrices();
        this.sendToAll('server:welcome', this.getWelcomeData());
    },
    async initPicksAndPMs() {
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
        console.log({ day, isWeekday });
        let dateStr = formatDate(now);

        if (!isWeekday) {
            // from most recent day (weekend will get friday)
            let pms = await fs.readdir('./json/prediction-models');
            let sortedFiles = pms
                .map(f => f.split('.')[0])
                .sort((a, b) => new Date(b) - new Date(a));
            console.log( sortedFiles[0],'0' )
            dateStr = sortedFiles[0];
        }
        
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
        console.log('mostRecentDay', dateStr);
        this.curDate = dateStr;

        let tickersOfInterest = flatten(picks.map(pick => {
            return pick.withPrices.map(tickerObj => tickerObj.ticker);
        }));
        tickersOfInterest = [...new Set(tickersOfInterest)];     // uniquify duplicate tickers

        this.tickersOfInterest = tickersOfInterest;
        this.picks = picks;

        console.log('numPicks', picks.length);
        console.log('numTickersOfInterest', tickersOfInterest.length)
    },
    calcPmPerfs() {
        return Object.entries(this.predictionModels).map(entry => {
            const [ stratName, trends ] = entry;
            // const foundStrategies = trends
            //     .filter(stratMin => {
            //         return stratMin.withPrices;
            //     });
            // console.log('found count', foundStrategies.length);
            let foundStrategies = trends
                .map(stratMin => {
                    const foundStrategy = this.picks.find(pick => pick.stratMin === stratMin);
                    if (!foundStrategy) return null;
                    const { withPrices } = foundStrategy;
                    if (typeof withPrices[0] === 'string') return;
                    const withTrend = withPrices.map(stratObj => {
                        const relPrices = this.relatedPrices[stratObj.ticker];
                        if (!relPrices) {
                            console.log('OH NO DAWG', stratObj.ticker, stratObj);
                            return {};
                        }
                        // console.log('relPrices', relPrices);
                        const { lastTradePrice, afterHoursPrice } = relPrices;
                        const nowPrice = afterHoursPrice || lastTradePrice;
                        return {
                            ticker: stratObj.ticker,
                            thenPrice: stratObj.price,
                            nowPrice,
                            trend: getTrend(nowPrice, stratObj.price)
                        };
                    });
                    const avgTrend = avgArray(
                        withTrend.map(obj => obj.trend)
                    );
                    // console.log('avg', avgTrend);
                    return avgTrend;
                });
            const overallAvg = avgArray(foundStrategies.filter(val => !!val));
            // console.log(stratName, 'overall', overallAvg);
            return {
                pmName: stratName,
                avgTrend: overallAvg
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
    },
    async getAndWaitPrices() {
        await this.getRelatedPrices();
        setTimeout(() => this.getAndWaitPrices(), 40000);
    },
    async getRelatedPrices() {
        // console.log(this.picks);
        console.log('getRelatedPrices');
        const tickersToLookup = this.tickersOfInterest;
        console.log('getting related prices', tickersToLookup.length);
        // console.log(JSON.stringify(tickersToLookup));
        const relatedPrices = await lookupTickers(
            this.Robinhood,
            tickersToLookup,
            true
        );

        // console.log(relatedPrices)
        this.relatedPrices = relatedPrices;
        this.sendToAll('server:related-prices', relatedPrices);
        console.log('done getting related prices');
        // console.log(JSON.stringify(relatedPrices, null, 2));
    }
};

module.exports = stratManager;
