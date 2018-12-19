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

        '[sepAdds]',
        '[sepHighlights]',
        '[sepStars]',
        '[hadAGoodDay]',
        '[filteredDrops]',

        '[spm-52day-lowThirdMinCount5MagicScore-slice16-uniq]',
        '[spm-52day-lowThirdMinCount5MagicScore-slice16-uniq]',
        '[spm-52day-bestAvgTrendAnyPlayout]',
        '[myRecs-day5count4-uniq-hundredUpPicks]',
        '[myRecs-day3count2to4-slice16-uniq-hundredUpAvgGt4]',
        '[unprovenSuddenDropsLast2Filter10]',
        '[unprovenSuddenDropsLast2Filter10]',
    ],
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
        ]
    }
};
