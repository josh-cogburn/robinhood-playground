const fs = require('mz/fs');
const jsonMgr = require('../utils/json-mgr');
const { avgArray } = require('../utils/array-math');
const stratManager = require('../socket-server/strat-manager');

module.exports = async (Robinhood, daysBack, minCount = 2, includeToday = true, ...searchString) => {
    daysBack = daysBack ? Number(daysBack) : 5;

    let files = await fs.readdir('./json/pm-perfs');

    let sortedFiles = files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b));

    
    const filesOfInterest = daysBack ? sortedFiles.slice(0 - daysBack) : [];

    console.log({ daysBack, filesOfInterest});


    const pmCache = {};
    const addTrend = (pm, trend) => {
        pmCache[pm] = (pmCache[pm] || []).concat(
            Number(trend)
        );
    };

    for (let file of filesOfInterest) {
        const json = await jsonMgr.get(`./json/pm-perfs/${file}.json`);
        json.forEach(({ pm, avgTrend }) => {
            addTrend(pm, avgTrend.slice(0, -1));
        });
    }

    if (includeToday) {
        await stratManager.init();
        const pmPerfs = stratManager.calcPmPerfs();
        pmPerfs.forEach(({ pmName, avgTrend }) => {
            addTrend(pmName, avgTrend);
        });
        // console.log({ pmPerfs, pmCache });
    }

    // console.log(pmCache);

    const pmAnalysis = {};
    Object.keys(pmCache).forEach(key => {
        const trends = pmCache[key].filter(t => Math.abs(t) < 50);
        const weighted = trends
            .map((trend, i) => Array(Math.round((Math.pow(i + 1, 2) * Math.max(0 - trend, 1)))).fill(trend))
            .reduce((a, b) => a.concat(b), []);
        pmAnalysis[key] = {
            avgTrend: avgArray(trends),
            // weighted,
            weightedTrend: avgArray(weighted),
            percUp: trends.filter(t => t > 0).length / trends.length,
            hundredResult: trends.reduce((acc, val) => {
                return acc * (100 + val) / 100;
            }, 100),
            trends
        };
    });

    // console.log(pmAnalysis);


    let sortedArray = Object.keys(pmAnalysis)
        .map(pm => ({
            pm,
            ...pmAnalysis[pm]
        }));

    if (searchString.length) {
        sortedArray = sortedArray.filter(t => searchString.every(p => t.pm.includes(p)));
    }
        

    sortedArray = sortedArray
        .filter(t => t.trends.length >= minCount)// && t.trends.every(a => a > -1));
        // .sort((a, b) => b.avgTrend - a.avgTrend)
        // .sort((a, b) => b.percUp - a.percUp)
        .sort((a, b) => b.weightedTrend - a.weightedTrend)
        // .filter(t => !t.pm.includes('myRecs'))
        // .filter(t => t.trends.every(v => v > -5))
        // .filter(t => t.hundredResult > 110)
        // .filter(t => t.pm.includes('spm'))
    
    
    
    // console.log(JSON.stringify(sortedArray, null, 2));


    return sortedArray;
};
