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
    purchaseAmt: 50,
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

        'sudden-drops-last5trend-filter10-100',
        'sudden-drops-last5trend-filter10-100',
        'sudden-drops-last5trend-filter10-100',

        '[afterhoursdropsGAMBLES]',

        // '[tripleDown]',
        // '[tripleDown]',
        // '[tripleDown]',

        // '[singleDown]',  // 5 everydayers,
        
        '[preMarketDrops]',
        // '[hadAGoodDay]', // 3 everydayers

        'constant-risers-10minute-percUpCloseOnlyPoints-filtered80-fiveTo10-40',
        'sudden-drops-last3trend-filter10-100',
        'constant-risers-10minute-percUpHighClosePoints-filtered70-80',

        'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-25',
        'low-float-high-volume-floatTimesfloatToVolume-trenddown7to10-25',

        'sudden-drops-last2trend-first1-400',
        'sudden-drops-last2trend-first1--30',
        'sudden-drops-last18trend-first2-fiveTo10--10',
        'first-greens-count1--15',
        'sudden-drops-last10trend-first2-fiveTo10--50',
        'sudden-drops-last18trend-first1--50',
        'sudden-drops-last1trend-first1-tenTo15--10'
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
