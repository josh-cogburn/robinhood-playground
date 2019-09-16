// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 15,
    purchaseAmt: 20,
    forPurchase: [
        '[sudden-drops]',
        '[sudden-drops]',
        

        ...`
            pennyscan-nowheres-zScoreHighSentLowRSI-lunch
            pennyscan-nowheres-zScoreInverseTrendMinusRSI-lunch
            
            pennyscan-droppers-zScoreInverseTrendMinusRSI-brunch

            pennyscan-droppers-zScoreInverseTrend-brunch

            pennyscan-droppers-zScoreHighSentLowRSI-lunch
            pennyscan-droppers-zScoreHotAndCool-lunch
            pennyscan-droppers-worstSS-dinner
            pennyscan-droppers-projectedVolume-dinner

            pennyscan-hot-st-worstSS-lunch



            pennyscan-unfiltered-zScoreGoingBadLookingGood-lunch
            pennyscan-unfiltered-zScoreInverseTrendMinusRSI-initial

            sudden-drops-shouldWatchout
            sudden-drops-notWatchout

            volume-increasing
        `.split('\n')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => `[${t}]`),

        // '[sep2019-sep15]',




        // '[rsi-daily]',
        
        // '[pennyscan-hot-st-singlePercMaxVolSS]',
        // '[pennyscan-unfiltered-singleTopVolumeSS]',
        // '[pennyscan-unfiltered-zScoreHotAndCool]',
        // '[pennyscan-unfiltered-zScoreHighSentLowRSI]',
        // '[pennyscan-unfiltered-zScoreMagic]',
        // '[rsi-daily]',

        // ...Object.keys(
        //     require('./pms/sep-2019')
        // ).map(v => `[${v}]`)


        // '[pennyscan-highHit360]',
        // '[pennyscan-highHit360]',
        // '[pennyscan-highHit360]',


        // '[pennyscan-highHit120]',
        // '[pennyscan-highHit120]',
        // '[pennyscan-highHit-streak1]',


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
