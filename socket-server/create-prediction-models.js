const manualPMs = require('../pms/manual');
const spms = require('../pms/spm');
const getMyRecs = require('../pms/my-recs');
const getTipTop = require('../pms/tip-top');
const settings = require('../settings');
const flatten = require('../utils/flatten-array');
const stratPerfOverall = require('../analysis/strategy-perf-overall');

module.exports = async (Robinhood) => {

    pastData = await (async () => {
        const stratPerfData = await stratPerfOverall(Robinhood, true, 4);
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
        return { fiveDay: stratPerfObj };
    })();

    const myRecs = await getMyRecs(Robinhood);
    const fiftytwo = await spms(Robinhood);
    const eightDay = await spms(Robinhood, 8);

    let strategies = {

        ...manualPMs,

        // myRecs
        ...Object.keys(myRecs).reduce((acc, val) => ({
            ...acc,
            [`myRecs-${val}`]: myRecs[val]
        }), {}),

        //8daySPMs
        ...Object.keys(eightDay).reduce((acc, val) => ({
            ...acc,
            [`spm-8day-${val}`]: eightDay[val]
        }), {}),
        
        //fiftytwodaySPMs
        ...Object.keys(fiftytwo).reduce((acc, val) => ({
            ...acc,
            [`spm-52day-${val}`]: fiftytwo[val]
        }), {}),

        ...await getTipTop(Robinhood)
    };

    console.log('done donezy');

    const flattenStrategiesWithPMs = array =>
        flatten(
            array.map(strat => {
                if (strat && strat.startsWith('[')) {
                    const pmStrats = strategies[strat.substring(1, strat.length - 1)];
                    if (!pmStrats) {
                        console.log('could not find strat', strat);
                    }
                    return pmStrats;
                }
                return strat;
            })
        );

    const forPurchase = flattenStrategiesWithPMs(settings.forPurchase);

    const forPurchaseVariations = (() => {
        const filterBy5DayPercUp = (perc, includeBlanks) => forPurchase
            .filter(strat => {
                const foundFiveDay = pastData.fiveDay[strat];
                return (includeBlanks && !foundFiveDay)
                    || (foundFiveDay && foundFiveDay.percUp >= perc / 100);
            });
        return [
            25,
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

    let forPurchasePMs = {
        forPurchase,
        ...forPurchaseVariations
    };

    const { forPurchaseVariation } = settings;
    if (forPurchaseVariation) {
        console.log('FOR PURCHASE VARIATION FOUND', forPurchaseVariation);
        forPurchasePMs = {
            ...forPurchasePMs,
            originalForPurchase: forPurchasePMs.forPurchase,
            forPurchase: forPurchasePMs[`forPurchase${forPurchaseVariation}`]
        };
        console.log(`FOR PURCHASE WENT FROM ${forPurchasePMs.originalForPurchase.length} to ${forPurchasePMs.forPurchase.length} strategies`);
    }

    return {
        ...strategies,
        ...forPurchasePMs
    };
};