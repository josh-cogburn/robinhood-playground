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


module.exports = {
    purchaseAmt: 44,
    forPurchase: [
        '[myRecs-day1-hundredResultCreme]',
        '[august2]'
    ],
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
