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
    purchaseAmt: 60,
    forPurchase: [
        '[anyCountPerfectos]',
        'based-on-jump-down5overnight-trending103-notWatchout-gtneg20percmax-first1-5',
        '[myRecs-day1-hundredResultCreme]'
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
