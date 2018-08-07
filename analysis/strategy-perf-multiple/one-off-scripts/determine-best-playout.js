const fs = require('mz/fs');
const jsonMgr = require('../../../utils/json-mgr');
const stratPerfMultiple = require('../index');
const { highestPlayoutFn } = require('../generate-breakdowns');

const {
    avgArray,
    // percUp,
    // hundredResult
} = require('../../../utils/array-math');


const considerThesePlayouts = [
    'limit1',
    'limit2',
    'limit3',
    'limit4',
    'limit5',
    'limit6',
    // 'limit8',
    // 'limit9',
    // 'limit10',
    // 'limit11',
    // 'limit12',
    'limit10Down5Up',
    'limit5Down10Up',
    'limit6Down4Up',
    'limit3Down6Up',
    'limit2Down5Up',
    'limit6Down12Up',
    'limit6Down3Up',
    'limit10Down3Up',
    'limit10Down1Up',
    'limit7Down3Up',
    // 'limitUp1',
    // 'limitUp2',
    // 'limitUp3',
    // 'limitUp4',
    // 'limitUp5',
    // 'limitUp6',
    // 'firstGreen',
    // 'changeGt1',
    // 'changeGt2',
    // 'changeGt3',
    // 'changeGt4',
    // 'changeGt5',
    // 'alwaysLast',
    // 'onlyMax'
];


const getMostRecentForPurchase = async () => {
    const getMostRecentDay = async () => {
        let files = await fs.readdir('./json/prediction-models');
        let sortedFiles = files
            .map(f => f.split('.')[0])
            .sort((a, b) => new Date(a) - new Date(b));
        return sortedFiles.pop();
    };

    const mostRecentDay = await getMostRecentDay();
    console.log(mostRecentDay);
    const mostRecentPMs = await jsonMgr.get(`./json/prediction-models/${mostRecentDay}.json`);
    const { forPurchase } = mostRecentPMs;
    return forPurchase;
};


const determineSingleBestPlayoutFromMultiOutput = pastPerf => {
    const playoutBreakdowns = {};
    pastPerf.forEach(perf => {
        Object.keys(perf.playouts).forEach(playout => {
            playoutBreakdowns[playout] = (playoutBreakdowns[playout] || []).concat(
                perf.playouts[playout].hundredResult
            )
        });
    });
    const playoutAggregated = Object.keys(playoutBreakdowns).reduce((acc, key) => ({
        ...acc,
        [key]: avgArray(playoutBreakdowns[key])
    }), {});
    // console.log(playoutAggregated);
};

const determineIndividualBestPlayoutsFromMultiOutput = pastPerf => {
    const scoreFn = ({ hundredResult, percUp, avgTrend, percHitsPositive, percHitPlayout }, count) =>
        percHitPlayout >= 0.5
            ? hundredResult * (3 * percUp) * avgTrend * (1 * percHitsPositive) * count
            : 0;
    const playoutFilter = playoutKey => considerThesePlayouts.includes(playoutKey);
    const getHighestPlayout = highestPlayoutFn(scoreFn, playoutFilter);
    return pastPerf.map(obj => ({
        strategy: obj.strategy,
        highestPlayout: getHighestPlayout(obj)[1]
    }));
};

module.exports = async (Robinhood, ...strategiesForConsideration) => {
    strategiesForConsideration = strategiesForConsideration.length ? strategiesForConsideration : await getMostRecentForPurchase();
    console.log(strategiesForConsideration);
    const pastPerf = await stratPerfMultiple(Robinhood, 50, ...strategiesForConsideration);
    // console.log(JSON.stringify(pastPerf, null, 2));
    determineSingleBestPlayoutFromMultiOutput(pastPerf);
    return determineIndividualBestPlayoutsFromMultiOutput(pastPerf);
};
