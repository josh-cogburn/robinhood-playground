const { lookupTickers } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const { CronJob } = require('cron');
const fs = require('mz/fs');
const manualPMs = require('../pms/manual');
const settings = require('../settings');

// predictions and past data
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const { predictCurrent, stratPerfPredictions } = require('../app-actions/predict-top-performing');
const getMyRecs = require('../pms/my-recs');
const getTipTop = require('../pms/tip-top');

const getTrend = require('../utils/get-trend');
const { avgArray } = require('../utils/array-math');
const sendEmail = require('../utils/send-email');

const formatDate = date => date.toLocaleDateString().split('/').join('-');
const getToday = () => formatDate(new Date());

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const stratManager = {
    Robinhood: null,
    io: null,
    picks: [],
    tickersOfInterest: [],
    relatedPrices: {},
    curDate: null,

    async init(io) {
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
        this.getAndWaitPrices();
        // console.log('send report init')
        // try {
        //     await this.sendStrategyReport();
        // } catch (e) {
        //     console.log('error sending report', e);
        // }
        console.log('initd strat manager');

        new CronJob(`40 7 * * 1-5`, () => this.newDay(), null, true);
    },
    getWelcomeData() {
        return {
            curDate: this.curDate,
            picks: this.picks,
            relatedPrices: this.relatedPrices,
            pastData: this.pastData,
            strategies: this.strategies
        };
    },
    newPick(data) {
        if (!this.tickersOfInterest.includes(data.ticker)) {
            this.tickersOfInterest.push(data.ticker);
        }
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
        this.io.emit(eventName, data);
    },
    async newDay() {
        console.log('NEW DAY')
        await this.getRelatedPrices();
        try {
            await this.sendStrategyReport();
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
        const dateStr = formatDate(now);

        const hasPicksData = await fs.exists(`./json/picks-data/${dateStr}`);
        if (!isWeekday || hasPicksData) {
            // from most recent day (weekend will get friday)
            await this.initPicks();
        } else {
            this.curDate = dateStr;
        }
        console.log('cur date now', this.curDate);
        await this.refreshPredictionModels();
    },
    async initPicks(dateStr) {
        console.log('init picks')
        const picks = [];

        let folders = await fs.readdir('./json/picks-data');
        let sortedFolders = folders.sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        const mostRecentDay = sortedFolders[sortedFolders.length - 1];
        console.log('mostRecentDay', mostRecentDay);
        this.curDate = mostRecentDay;
        let files = await fs.readdir(`./json/picks-data/${mostRecentDay}`);
        for (let file of files) {
            const strategyName = file.split('.')[0];
            const obj = await jsonMgr.get(`./json/picks-data/${mostRecentDay}/${file}`);
            for (let min of Object.keys(obj)) {
                // for each strategy run
                picks.push({
                    stratMin: `${strategyName}-${min}`,
                    withPrices: obj[min]
                });
            }
        }
        let tickersOfInterest = flatten(picks.map(pick => {
            return pick.withPrices.map(tickerObj => tickerObj.ticker);
        }));
        tickersOfInterest = [...new Set(tickersToLookup)];     // uniquify duplicate tickers

        this.tickersOfInterest = tickersOfInterest;
        this.picks = picks;
    },
    async sendStrategyReport() {
        console.log('sending strategy report');
        // console.log('STRATS HERE', this.strategies);
        const strategyReport = Object.entries(this.strategies).map(entry => {
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
                pm: stratName,
                avgTrend: overallAvg
            };
        })
            .filter(t => !!t.avgTrend)
            .sort((a, b) => Number(b.avgTrend) - Number(a.avgTrend))
            .map(({ pm, avgTrend }) => ({
                pm,
                avgTrend: avgTrend.toFixed(2) + '%'
            }));
        const emailFormatted = strategyReport.map(strat => {
            return `${strat.avgTrend} ${strat.pm}`;
        }).join('\n');
        await sendEmail(`robinhood-playground: 24hr report for ${this.curDate}`, emailFormatted);
        await jsonMgr.save(`./json/pm-perfs/${this.curDate}.json`, strategyReport);
        console.log('send and updated strategy report')
    },
    async createAndSaveNewPredictionModels(todayPMpath) {
        console.log('creating new prediction models');
        const newPMs = await this.createPredictionModels();
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
        this.strategies = foundDayPMs ? foundDayPMs : await this.createAndSaveNewPredictionModels(todayPMpath);
    },
    async refreshPastData() {
        console.log('refreshing past data');
        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        await this.setPastData(stratPerfData);
    },
    async createPredictionModels() {
        console.log('TESTING')

        // const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        const mapNames = strats => strats.map(({ name }) => name);
        const getFirstN = (strats, n) => strats.slice(0, n);
        const createPerms = (set, name, picks) => {
            return set.reduce((acc, val) => ({
                ...acc,
                [`${name}-first${val}`]: getFirstN(picks, val)
            }), {});
        };

        const createPermsForObj = (set, name, stratPerf) => {
            return Object.keys(stratPerf).reduce((acc, val) => ({
                ...acc,
                ...createPerms(set, `${name}-${val}`, stratPerf[val])
            }), {});
        };

        const filteredCount = trend => trend.filter(strat => {
            // console.log('STRATMAN', strat);
            return strat.count >= 5 && strat.count <= 6;
        });

        const myRecs = await getMyRecs(this.Robinhood);

        let strategies = {

            ...manualPMs,

            // myRecs
            ...Object.keys(myRecs).reduce((acc, val) => ({
                ...acc,
                [`myRecs-${val}`]: myRecs[val]
            }), {}),

            ...await getTipTop(this.Robinhood)
        };

        console.log('done donezy');

        const flattenStrategiesWithPMs = array =>
            flatten(
                array.map(strat =>
                    strat && strat.startsWith('[')
                        ? strategies[strat.substring(1, strat.length - 1)]
                        : strat
                )
            );

        const forPurchase = flattenStrategiesWithPMs(settings.forPurchase);

        const forPurchaseVariations = (() => {
            const filterBy5DayPercUp = (perc, includeBlanks) => forPurchase
                .filter(strat => {
                    const foundFiveDay = this.pastData.fiveDay[strat];
                    return (includeBlanks && !foundFiveDay)
                        || (foundFiveDay && foundFiveDay.percUp >= perc / 100);
                });
            return [
                50,
                75,
                80,
                100
            ].reduce((acc, perc) => ({
                [`forPurchase${perc}Perc5Day-notincludingblanks`]: filterBy5DayPercUp(perc),
                [`forPurchase${perc}Perc5Day-yesincludingblanks`]: filterBy5DayPercUp(perc, true),
                ...acc
            }), {});
        })();

        return {
            ...strategies,
            forPurchase,
            ...forPurchaseVariations
        };
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
        setTimeout(this.getAndWaitPrices, 40000);
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
