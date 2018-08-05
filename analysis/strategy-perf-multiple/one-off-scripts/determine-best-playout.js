const fs = require('mz/fs');
const jsonMgr = require('../../../utils/json-mgr');
const stratPerfMultiple = require('../index');
const {
    avgArray,
    // percUp,
    // hundredResult
} = require('../../../utils/array-math');

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


const determineBestPlayoutFromMultiOutput = pastPerf => {
    const playoutBreakdowns = {};
    pastPerf.forEach(perf => {
        Object.keys(perf.playouts).forEach(playout => {
            playoutBreakdowns[playout] = (playoutBreakdowns[playout] || []).concat(
                perf.playouts[playout].avgTrend
            )
        });
    });
    const playoutAggregated = Object.keys(playoutBreakdowns).reduce((acc, key) => ({
        ...acc,
        [key]: avgArray(playoutBreakdowns[key])
    }), {});
    console.log(playoutAggregated);
}

module.exports = async (Robinhood) => {
    const strategiesForConsideration = await getMostRecentForPurchase();
    console.log(strategiesForConsideration);
    const pastPerf = await stratPerfMultiple(Robinhood, 50, ...strategiesForConsideration);
    console.log(JSON.stringify(pastPerf, null, 2));
    determineBestPlayoutFromMultiOutput(pastPerf);
};
