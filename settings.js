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
    purchaseAmt: 70,
    forPurchase: [
        '[sepPerfectosLowCounts]',
        '[sepPerfectosLowCounts]',

        '[sepPerfectosRealLowCounts]',
        '[sepPerfectosRealLowCounts]',
        '[sepPerfectosRealLowCounts]',

        '[sepPerfectosMissing]',
        '[sepPerfectosMissing]',
        '[sepPerfectosMissing]',

        '[sepAdds]',
        '[sepAdds]',
        '[sepAdds]',

        '[sep17MORE]',
        '[sep17MORE]',
        '[sep17MORE]',

        '[afterhoursdropsGAMBLES]',

        // '[tripleDown]',
        // '[tripleDown]',
        // '[tripleDown]',

        // '[singleDown]',  // 5 everydayers,
        
        '[preMarketDrops]',
        // '[hadAGoodDay]', // 3 everydayers

        'constant-risers-10minute-percUpCloseOnlyPoints-filtered80-fiveTo10-40',
        'constant-risers-10minute-percUpCloseOnlyPoints-filtered80-fiveTo10-40',
        'sudden-drops-last3trend-filter10-100',
        'constant-risers-10minute-percUpHighClosePoints-filtered70-80',
        'constant-risers-10minute-percUpHighClosePoints-filtered80-fiveTo10-80'
    ],
    fallbackSellStrategy: 'limit3',
    force: {
        sell: [
            'FIHD'
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
