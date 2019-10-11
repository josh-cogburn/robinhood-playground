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
    purchaseAmt: 20,
    forPurchase: [

        // 2/5 sudden drops - TOTAL 42


        ...pm(`
            avg-downer 3
            avg-downer 3
            sudden-drops-notWatchout 20
            sudden-drops-notWatchout 20
            sudden-drops-notWatchout-initial 15
            sudden-drops-notWatchout-initial 15
            sudden-drops-notWatchout-brunch 5
            sudden-drops-notWatchout-brunch 5
            sudden-drops-notWatchout-lunch 8
            sudden-drops-notWatchout-lunch 8
            sudden-drops-notWatchout-lunch 8
            sudden-drops-notWatchout-dinner 2
            sudden-drops-notWatchout-dinner 2
            sudden-drops-notWatchout-dinner 2
            sudden-drops-notWatchout-dinner 2

            sudden-drops-notWatchout-mediumJump 6
            sudden-drops-notWatchout-mediumJump 6
            sudden-drops-notWatchout-mediumJump 6
            sudden-drops-notWatchout-mediumJump 6
            sudden-drops-notWatchout-mediumJump 6


            sudden-drops-notWatchout-majorJump 5
            sudden-drops-notWatchout-majorJump 5
            sudden-drops-notWatchout-majorJump 5
            sudden-drops-notWatchout-majorJump 5
            sudden-drops-notWatchout-majorJump 5
            sudden-drops-notWatchout-lunch 4
            sudden-drops-notWatchout-lunch 4
        `, 1, 'general sudden-drops'),  // 17

        // 
        ...pm(`
            overnight-drops-mediumJump 4
            overnight-drops-mediumJump 4
        `, 1, 'turnt')

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
