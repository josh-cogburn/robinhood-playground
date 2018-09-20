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
    purchaseAmt: 110,
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
        '[doubleDown]',
        '[doubleDown]'
    ],
    fallbackSellStrategy: 'limit3',
    force: {
        sell: [
            // 'FCNCA',
            // 'EBMT'
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
