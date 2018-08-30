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
    sellAllStocksOnNthDay: 2,
    purchaseAmt: 20,
    forPurchase: [
        '[aug29LowCountsABQuality]',    // 3x power up!
        '[aug29LowCountsABQuality]',
        '[aug29LowCountsABQuality]',

        '[aug29LowCountsGradeC]',       // low count and grade c
        '[aug29MedHighCounts]',         // everydayers
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
