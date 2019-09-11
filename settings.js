// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 10,
    forPurchase: [
        '[sudden-drops]',
        // '[rsi-daily]',
        
        // '[pennyscan-hot-st-singlePercMaxVolSS]',
        // '[pennyscan-unfiltered-singleTopVolumeSS]',
        // '[pennyscan-unfiltered-zScoreHotAndCool]',
        // '[pennyscan-unfiltered-zScoreHighSentLowRSI]',
        // '[pennyscan-unfiltered-zScoreMagic]',
        '[rsi-daily]',

        // ...Object.keys(
        //     require('./pms/sep-2019')
        // ).map(v => `[${v}]`)

        '[pennyscan-highHit360]',
        '[pennyscan-highHit360]',
        '[pennyscan-highHit120]',

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
    }
};
