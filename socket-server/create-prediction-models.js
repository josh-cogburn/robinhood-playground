const manualPMs = require('../pms/manual');
const fiftytwodaySPMs = require('../pms/spm');
const getMyRecs = require('../pms/my-recs');
const getTipTop = require('../pms/tip-top');

module.exports = async (Robinhood) => {
    console.log('TESTING');

    const myRecs = await getMyRecs(Robinhood);
    const fiftytwo = await fiftytwodaySPMs(Robinhood);
    let strategies = {

        ...manualPMs,

        // myRecs
        ...Object.keys(myRecs).reduce((acc, val) => ({
            ...acc,
            [`myRecs-${val}`]: myRecs[val]
        }), {}),
        
        //fiftytwodaySPMs
        ...Object.keys(fiftytwo).reduce((acc, val) => ({
            ...acc,
            [`spm-52day-${val}`]: fiftytwo[val]
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