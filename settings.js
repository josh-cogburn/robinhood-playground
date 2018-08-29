const cheapestPicksEmailList = require('./cheapest-picks-email-list');
const cheapestPicksEmailObj = cheapestPicksEmailList
    .reduce((acc, val) => ({
        ...acc,
        [val]: 'cheapest-picks-chp50--4'
    }), {});

const {
    creme,
    moderates,
    occasionals,
    occasionalLowCount,
    keepAnEyeOn,
    allShorts
} = require('./pms/manual');



// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 1,
    purchaseAmt: 22,
    forPurchase: [
        '[combinedWeekOfAug27ANDAug28BasedOnPerfectosRealLowCounts]',   // 7
        '[combinedWeekOfAug27ANDAug28BasedOnPerfectosRealLowCounts]',
        '[combinedWeekOfAug27ANDAug28BasedOnPerfectosRealLowCounts]',

        '[combinedWeekOfAug27ANDAug28BasedOnPerfectosLowAndMedCount]',  // 11
        '[combinedWeekOfAug27ANDAug28BasedOnPerfectosLowAndMedCount]',

        '[combinedWeekOfAug27ANDAug28BasedOnPerfectosHighCount]'        // 8
    ],
    sellStrategy: 'limit3',     // for fallback,
    keepers: [
        // 'NSPR',
        // 'BOXL',
        // 'SEII',
        // 'AWX'
    ],

    // email
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: [
            // ...allShorts
        ],
        ...cheapestPicksEmailObj
    }
};
