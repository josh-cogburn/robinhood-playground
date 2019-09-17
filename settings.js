// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 15,
    purchaseAmt: 10,
    forPurchase: [
        '[sudden-drops-notWatchout]',
        
        '[sep2019-sep15]',
        '[sep2019-sep16]',
        '[sep2019-sep17]',
        '[sep2019-sep15Unfiltered]',
        '[sep2019-sep15Unfiltered]',


        // keep an eye on
        // pennyscan-droppers-zScoreInverseTrendMinusRSI-brunch
        // pennyscan-droppers-zScoreHighSentLowRSI-lunch

        // sudden-drops-shouldWatchout
        // sudden-drops-notWatchout
        // volume-increasing

        // pennyscan-droppers-worstSS-dinner
        // pennyscan-unfiltered-singlePercMaxVolSS-lunch
        ...`
            pennyscan-nowheres-zScoreInverseTrendMinusRSI-lunch
            pennyscan-droppers-zScoreInverseTrend-brunch

            pennyscan-droppers-zScoreHotAndCool-lunch
            pennyscan-droppers-zScoreHotAndCool-lunch
            
            pennyscan-droppers-projectedVolume-dinner

            pennyscan-hot-st-worstSS-lunch
            pennyscan-hot-st-dollarVolume-lunch
            pennyscan-hot-st-zScoreMagic-dinner
            
        `.split('\n')
        .map(t => t.trim())
        .filter(Boolean)
        .map(t => `[${t}]`),




        // double POWER
        // 'pennyscan-volume-increasing-5min-firstAlert-notWatchout-dinner-5000',
        'pennyscan-hot-st-zScoreHotAndCool-firstAlert-notWatchout-dinner-5000',



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
