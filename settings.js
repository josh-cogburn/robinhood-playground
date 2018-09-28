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
    purchaseAmt: 40,
    forPurchase: [
        '[backToTheBasicsPeople]',
        'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-25',
        'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-shouldWatchout-25',
        '[myRecs-day40-hundredResultCreme]',
        '[myRecs-day30-hundredResultCreme]',
        '[myRecs-day30count7-hundredUpTrendsAllGt1]',
        
        '[heavydutyhitters]',
        '[constantinople]'
    ],
    fallbackSellStrategy: 'limit3',
    force: {
        sell: [
            // 'FIHD'
        ],
        keep: [
            // 'NSPR',
            // 'BOXL',
            // 'SEII',
            // 'AWX'
        ]
    },

    // email
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: [
            // ...allShorts
        ],
        ...cheapestPicksEmailObj
    }
};
