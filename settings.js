// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 120,
    forPurchase: [
        '[sudden-drops-majorJumpDinner]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-notWatchout]',
        '[sudden-drops-lunch]',
        '[sudden-drops-lunch]',

        '[sep2019-rsi10]',
        '[sep2019-rsiDaily]',

        '[pennyscan-droppers-zScoreInverseTrend-brunch]',
        '[pennyscan-droppers-zScoreInverseTrend-brunch]',
        '[pennyscan-droppers-zScoreInverseTrendMinusRSI-brunch]',
        '[pennyscan-droppers-zScoreHighSentLowRSI-lunch]',
        '[pennyscan-droppers-zScoreHighSentLowRSI-lunch]',
        '[pennyscan-droppers-zScoreHotAndCool-lunch]',
        '[pennyscan-unfiltered-singlePercMaxVolSS-initial]',


        '[rsi-lt5-notWatchout-10min]',
        '[rsi-lt10-notWatchout-10min]',
        '[rsi-lt15-notWatchout-10min]',
        // '[sudden-drops-shouldWatchout]',

        
        // '[sep2019-rsi10]',
        // '[sep2019-sep15]',
        // '[sep2019-sep16]',
        // '[sep2019-sep17]',
        // '[sep2019-sep18]',
        // '[sep2019-sep15Unfiltered]',


        // keep an eye on
        // pennyscan-droppers-zScoreInverseTrendMinusRSI-brunch
        // 

        // sudden-drops-shouldWatchout
        // sudden-drops-notWatchout
        // volume-increasing

        // pennyscan-droppers-worstSS-dinner
        // pennyscan-unfiltered-singlePercMaxVolSS-lunch
        // ...`
        //     pennyscan-hot-st-worstSS-brunch
        //     pennyscan-droppers-zScoreHighSentLowRSI-lunch
        //     pennyscan-droppers-zScoreInverseTrendMinusRSI-brunch
        //     pennyscan-nowheres-zScoreInverseTrendMinusRSI-lunch
        //     pennyscan-droppers-zScoreInverseTrend-brunch

        //     pennyscan-droppers-zScoreHotAndCool-lunch
        //     pennyscan-droppers-zScoreHotAndCool-lunch
            
        //     pennyscan-droppers-projectedVolume-dinner

        //     pennyscan-hot-st-worstSS-lunch
        //     pennyscan-hot-st-dollarVolume-lunch

        //     pennyscan-unfiltered-singlePercMaxVolSS-initial
        //     pennyscan-nowheres-zScoreHotAndCool-brunch
        //     pennyscan-hot-st-worstSsTrendRatio-brunch
            
        // `.split('\n')
        // .map(t => t.trim())
        // .filter(Boolean)
        // .map(t => `[${t}]`),




        // double POWER
        // 'pennyscan-volume-increasing-5min-firstAlert-notWatchout-dinner-5000',
        // 'pennyscan-hot-st-zScoreHotAndCool-firstAlert-notWatchout-dinner-5000',



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
