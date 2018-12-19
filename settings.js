// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 2,
    purchaseAmt: 25,
    forPurchase: [
        // modern picks
        '[postMongoBigHitters]',
        '[postMongoTimes2]',
        '[dec17]',
        '[postMongoCount3]',

        // old timers thanks to pm analysis
        '[unprovenFilter30Drops]',
        '[unprovenFilter30Drops]',
        '[unprovenFilter30Drops]',
        '[unprovenFilter30Drops]',

        '[unprovenFilter20Drops]',
        '[unprovenFilter20Drops]',

        '[sepAdds]',
        '[sepHighlights]',
        '[sepStars]',
        '[hadAGoodDay]',
        '[filteredDrops]',

        '[myRecs-day1-whileLoopCreme]',
        '[myRecs-day7count3-hundredWithHundredCheck]',          /// ??????
        '[myRecs-day10count5-hundredUpAvgGt4]',                 /// ??????


        '[spm-52day-lowThirdMinCount5MagicScore-slice16-uniq]',
        '[spm-52day-lowThirdMinCount5MagicScore-slice16-uniq]',
        '[spm-52day-bestAvgTrendAnyPlayout]',
        '[spm-52day-highLimitPlayoutsAvgTrend-slice16]',        /// ??????
        '[spm-52day-bestFirstGreenAvgTrend-slice16-uniq]',      /// ??????
        '[tiptop-minCount4]',

        '[myRecs-day5count4-uniq-hundredUpPicks]',
        '[myRecs-day3count2to4-slice16-uniq-hundredUpAvgGt4]',
        '[unprovenSuddenDropsLast2Filter10]',
        '[unprovenSuddenDropsLast2Filter10]',
    ],
    // forPurchaseVariation: '75Perc5Day-yesincludingblanks',
    fallbackSellStrategy: 'limit3',
    force: {
        sell: [
            // 'FIHD'
        ],
        keep: [
            // 'NSPR',
            // 'BOXL',
            // 'SEII',
            // 'AWX'
            'ESES'
        ]
    }
};
