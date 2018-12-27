const manualPMs = require('../pms/manual');
const spms = require('../pms/spm');
const getMyRecs = require('../pms/my-recs');
const getTipTop = require('../pms/tip-top');
const topPerforming = require('../pms/top-performing');

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
    const tp = await topPerforming(Robinhood);

    const prependKeys = (obj, prefix) => Object.keys(obj).reduce((acc, val) => ({
        ...acc,
        [`${prefix}${val}`]: obj[val]
    }), {});

    let strategies = {

        ...manualPMs,

        // myRecs
        ...prependKeys(myRecs, 'myRecs-'),

        //8daySPMs
        ...prependKeys(eightDay, 'spm-8day-'),
        
        //fiftytwodaySPMs
        ...prependKeys(fiftytwo, 'spm-52day-'),

        //top-performers
        ...prependKeys(tp, 'top-performers-'),

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

    // settings...

    // for purchase variations
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

    // uniqfy for purchase .... because avg was doing better than weighted?
    const { uniqifyForPurchase } = settings;
    if (uniqifyForPurchase) {
        const uniqFP = [...new Set(forPurchasePMs.forPurchase)];
        forPurchasePMs = {
            ...forPurchasePMs,
            ['forPurchase-notUniq']: uniqFP,
            ['forPurchase-uniq']: uniqFP,
            forPurchase: uniqFP
        };
    }

    return {
        ...strategies,
        ...forPurchasePMs
    };
};