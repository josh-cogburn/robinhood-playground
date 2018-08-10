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
    purchaseAmt: 26,
    forPurchase: [
        // 3x                               // 42
        '[filteredDrops]',                      // 14
        '[filteredDrops]',                      // 14
        '[filteredDrops]',                      // 14

        // 2x                               // 4
        '[qualityModerates]',                   // 2
        '[qualityModerates]',                   // 2

        // 1x                               // 6
        '[myRecs-day1-hundredResultCreme]',     // 1
        '[moreCommonDrops]',                    // 3
        '[greatEverydayPerformers]'             // 2
    ],
    sellStrategy: 'limit10Down3Up',

    // email
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: [
            // ...creme,
            // ...moderates,
            // ...occasionals,
            // ...occasionalLowCount,
            // ...keepAnEyeOn,
            // ...allShorts
        ],
        ...cheapestPicksEmailObj
    }
};
