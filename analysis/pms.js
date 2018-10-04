const fs = require('mz/fs');
const jsonMgr = require('../utils/json-mgr');
const { avgArray } = require('../utils/array-math');

module.exports = async (Robinhood, daysBack = 5, minCount = 5) => {

    let files = await fs.readdir('./json/pm-perfs');

    let sortedFiles = files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b));

    const filesOfInterest = sortedFiles.slice(0 - daysBack);

    console.log(filesOfInterest);


    const pmCache = {};
    for (let file of filesOfInterest) {
        const json = await jsonMgr.get(`./json/pm-perfs/${file}.json`);
        json.forEach(({ pm, avgTrend }) => {
            pmCache[pm] = (pmCache[pm] || []).concat(
                Number(avgTrend.slice(0, -1))
            );
        });
    }

    // console.log(pmCache);

    const pmAnalysis = {};
    Object.keys(pmCache).forEach(key => {
        const trends = pmCache[key].filter(t => Math.abs(t) < 50);
        pmAnalysis[key] = {
            avgTrend: avgArray(trends),
            percUp: trends.filter(t => t > 0).length / trends.length,
            hundredResult: trends.reduce((acc, val) => {
                return acc * (100 + val) / 100;
            }, 100),
            trends
        };
    });

    // console.log(pmAnalysis);


    const sortedArray = Object.keys(pmAnalysis)
        .map(pm => ({
            pm,
            ...pmAnalysis[pm]
        }))
        .sort((a, b) => b.avgTrend - a.avgTrend)
        .sort((a, b) => b.percUp - a.percUp)
        // .filter(t => !t.pm.includes('myRecs'))
        // .filter(t => t.trends.every(v => v > -5))
        // .filter(t => t.hundredResult > 110)
        .filter(t => t.trends.length >= minCount)// && t.trends.every(a => a > -1));
    console.log(JSON.stringify(sortedArray, null, 2));


    return sortedArray;
};
