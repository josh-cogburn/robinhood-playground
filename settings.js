// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase

let expectedPickCount = 0;
// const pm = (str, multiplier = 1, groupName) => {

//     let totalCount = 0;
//     const lines = str.split('\n').map(line => line.trim()).filter(Boolean);
//     const onlyPms = lines.map(line => {
//         const [pm, count] = line.split(' ');
//         totalCount += Number(count || 1);
//         return pm;
//     });
//     const withMultiplier = totalCount * multiplier;
//     console.log({
//         groupName,
//         totalCount,
//         withMultiplier
//     });
//     expectedPickCount += withMultiplier;
//     return Array(multiplier).fill(onlyPms).flatten().map(pm => `[${pm}]`);
// };


module.exports = {
    // important settings
    sellAllStocksOnNthDay: 8,
    purchaseAmt: 2,
    forPurchase: [


        // baselines

        '[sudden-drops-lunch]',
        '[sudden-drops-lunch]',
        '[sudden-drops-majorJump]',
        '[sudden-drops-majorJump-straightDown]',
        '[sudden-drops-mediumJump]',
        '[sudden-drops-zeroToOne]',
        '[sudden-drops-watchout-down]',
        '[sudden-drops-down15-straightDown]',


        // more
        '[sudden-drops-dinner-down-straightDown30]',
        '[sudden-drops-watchout-mediumJump-down]',
        '[sudden-drops-watchout-minorJump-brunch-down]',
        '[sudden-drops-watchout-down-!straightDown]',
        '[sudden-drops-minorJump-lunch-down10-straightDown]',
        '[sudden-drops-watchout-down15-straightDown30]',
        '[sudden-drops-watchout-down30]',
        '[sudden-drops-watchout-down10]',
        '[sudden-drops-lunch-down20]',
        '[sudden-drops-watchout-!straightDown]',
        '[sudden-drops-watchout-minorJump]',

        // yes today trend high percUp
        '[sudden-drops-lowVolFitty]',
        '[sudden-drops-dinner-!down-!straightDown]',
        '[sudden-drops-dinner-down15-straightDown]',
        '[sudden-drops-!watchout-minorJump-!down-!straightDown]',
        '[sudden-drops-mediumJump-dinner-down]',
        '[sudden-drops-minorJump-down10]',
        '[sudden-drops-minorJump-!straightDown]',

        // no today trend but 90% percUp
        '[sudden-drops-majorJump-down]',
        '[sudden-drops-brunch-down10]',
        '[sudden-drops-mediumJump-brunch-!straightDown]',
        '[sudden-drops-!watchout-majorJump-!straightDown]',
        '[sudden-drops-mediumJump-down15]',
        '[sudden-drops-mediumJump-down15]',
        '[sudden-drops-watchout-mediumJump-initial]',

        '[average-down-recommendation]'

    ],
    // forPurchaseVariation: '75Perc5Day-yesincludingblanks',
    // fallbackSellStrategy: 'limit8',
    disableMultipliers: false,
    force: {
        sell: [
        ],
        keep: [
            'ACIU',
            'UEPS',
            'MNGA'
        ]
    },
    // expectedPickCount
};
