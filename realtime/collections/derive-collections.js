const { uniq, mapObject } = require('underscore');

const deriveCollections = collections => {


    const allScanResults = uniq(
        Object.values(collections).flatten().filter(t => t.computed),
        result => result.ticker
    );

    // strlog({ allScanResults })

    const getMovers = results => results
        .sort((a, b) => b.computed.tso - a.computed.tso)
        .slice(0, 5);

    const getUnusualVolume = results => results
        .sort((a, b) => b.computed.projectedVolumeTo2WeekAvg - a.computed.projectedVolumeTo2WeekAvg)
        .slice(0, 5);

    const getMoverVolume = results => getUnusualVolume(
        results
            .sort((a, b) => b.computed.tsc - a.computed.tsc)
            .slice(0, 50)
    );

    const derivedCollections = {


        nowhereVolume: results => getUnusualVolume(
            results
                .filter(t => t.computed.dailyRSI < 50)
                .filter(t => t.computed.tso > -1 && t.computed.tso < 3 && t.computed.tsc > -1 && t.computed.tsc < 3)
        ),

        realChillMovers: results => getMovers(
            results.filter(t => t.computed.dailyRSI < 40)
        ),

        realChillMoverVolume: results => getMoverVolume(
            results.filter(t => t.computed.dailyRSI < 40)
        ),

        chillMovers: results => getMovers(
            results.filter(t => t.computed.dailyRSI < 50)
        ),

        chillMoverVolume: results => getMoverVolume(
            results.filter(t => t.computed.dailyRSI < 50)
        ),

        movers: results => getMovers(
            results.filter(t => t.computed.dailyRSI < 80)
        ),

        movers: results => getMovers(
            results.filter(t => t.computed.dailyRSI < 80)
        ),



        slightUpVolume: results => getUnusualVolume(
            results
                .filter(t => t.computed.dailyRSI < 50)
                .filter(t => t.computed.tso > 1 && t.computed.tsc > 1 && t.computed.tsc < 6)
        ),

    };

    let unusedResults = [
        ...allScanResults.filter(t => t.computed.projectedVolume > 70000)
    ];
    return mapObject(
        derivedCollections,
        (fn, something) => {
            strlog({
                something,
                count: unusedResults.length
            })
            const response = fn(unusedResults);
            unusedResults = unusedResults.filter(t => !response.map(t => t.ticker).includes(t.ticker));    // no repeats
            return response;
        }
    );
};


module.exports = deriveCollections;