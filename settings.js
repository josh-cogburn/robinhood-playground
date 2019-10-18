// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase

let expectedPickCount = 0;
const pm = (str, multiplier = 1, groupName) => {

    let totalCount = 0;
    const lines = str.split('\n').map(line => line.trim()).filter(Boolean);
    const onlyPms = lines.map(line => {
        const [pm, count] = line.split(' ');
        totalCount += Number(count || 1);
        return pm;
    });
    const withMultiplier = totalCount * multiplier;
    console.log({
        groupName,
        totalCount,
        withMultiplier
    });
    expectedPickCount += withMultiplier;
    return Array(multiplier).fill(onlyPms).flatten().map(pm => `[${pm}]`);
};


module.exports = {
    // important settings
    sellAllStocksOnNthDay: 8,
    purchaseAmt: 7,
    forPurchase: [

        // 2/5 sudden drops - TOTAL 42


        ...pm(`
            sudden-drops-!watchout-down10 6
            sudden-drops-!watchout 10
            sudden-drops-watchout-down10 5
            sudden-drops-lunch 3
            sudden-drops-down15 3
            sudden-drops-down20 3
            sudden-drops-down30 3
            sudden-drops-down40 3
            sudden-drops-straightDown90 3
            sudden-drops-majorJump 2
            sudden-drops-down15-straightDown 2
            sudden-drops-down10-straightDown 1
            sudden-drops-mediumJump-down15 3
        `, 1, 'simplicity'),  // 17

        ...pm(`
            overnight-drops-!watchout-mediumJump 2
        `, 1, 'overnight'),  // 17

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
    expectedPickCount
};
