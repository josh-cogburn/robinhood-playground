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
    purchaseAmt: 44,
    forPurchase: [
        '[myRecs-day1-hundredResultCreme]',
        '[august2]'
    ],
    sellStrategy: 'limit10Down3Up',

    // email
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: [
            ...creme,
            ...moderates,
            ...occasionals,
            ...occasionalLowCount,
            ...keepAnEyeOn,
            ...allShorts
        ],
        ...cheapestPicksEmailObj
    }
};
