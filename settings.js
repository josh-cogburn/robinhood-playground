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
    purchaseAmt: 120,
    forPurchase: [

        ...pm(`
            avg-downer 3
        `, 4, 'avg downers'),

        // 2/5 sudden drops - TOTAL 42

        ...pm(`
            sudden-drops-notWatchout 15
            sudden-drops-notWatchout 15
            sudden-drops-notWatchout 15
            sudden-drops-notWatchout-minorJump-brunch 2
            sudden-drops-notWatchout-majorJump 1
            sudden-drops-majorJump-dinner 1
            sudden-drops-notWatchout-initial 6
            sudden-drops-shouldWatchout 2
        `, 2, 'sudden drops'),

        // 1/5 rsi - TOTAL 42
        // ...pm(`
        //     rsi-10min-shouldWatchout-firstAlert-dinner 5
        //     rsi-10min-shouldWatchout-firstAlert-dinner 5
        //     rsi-10min-rsilt10-dinner 5
        //     rsi-30min-shouldWatchout-rsilt15-dinner 2
        //     rsi-30min-shouldWatchout-rsilt15-dinner 2
        //     rsi-firstAlert-rsilt5-dinner 1
        //     rsi-30min-shouldWatchout-firstAlert-rsilt15-lunch 2
        //     rsi-10min-notWatchout-rsilt10 16
        //     rsi-10min-notWatchout-rsilt5 3
        //     rsi-10min-notWatchout-rsilt5 3
        //     rsi-10min-notWatchout-firstAlert-rsilt15 10
        // `, 1, 'RSI'),

        // september - TOTAL 25
        // ...pm(`
        //     sep2019-sep17 24
        //     sep2019-sep15 8
        //     sep2019-sep15 8
        // `, 1, 'sep 1517'),
        
        // 1/5 other stuff - TOTAL 10
        // ...pm(`
        //     pennyscan-droppers-projectedVolume-dinner 1
        //     pennyscan-droppers-zScoreInverseTrendPlusVol-dinner 1
        //     pennyscan-unfiltered-projectedVolume-dinner 1
        //     pennyscan-droppers-dollarVolume-dinner 1
        //     pennyscan-droppers-worstSsTrendRatio-brunch 1
        //     pennyscan-droppers-zScoreInverseTrendPlusVol-dinner 1
        //     sep2019-sep18 1
        //     sep2019-sep18 1
        //     sep2019-sep18 1
        //     sep2019-sep18 1
        //     sep2019-sep18 1
        //     sep2019-sep18 1
        //     sep2019-pennyscans 4
        //     multi-hits-3count-shouldWatchout-firstAlert-dinner 4
        // `, 3, 'other stuff'),

        // rarities 1/5 - TOTAL 6
        // ...pm(`
        //     multi-hits-5count-shouldWatchout-dinner
        //     sep2019-rsiDaily
        //     pennyscan-droppers-worstSsTrendRatio-brunch
        //     sep2019-rsi10
        //     pennyscan-hot-st-dollarVolume-lunch
        //     pennyscan-unfiltered-dollarVolume-brunch
        //     pennyscan-droppers-zScoreHotAndCool-lunch
        // `, 2, 'rarities')


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
    expectedPickCount: expectedPickCount * 1.1
};
