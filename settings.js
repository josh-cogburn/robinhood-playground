// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 2,
    purchaseAmt: 30,
    forPurchase: [


        // how bout this folks????
        'best-st-sentiment-bullBearScore--25',
        'best-st-sentiment-withSentiment--25',
        'best-st-sentiment-withSentAndVol--25',
        'best-st-sentiment-bullBearScore-300',
        'best-st-sentiment-withSentiment-300',
        'best-st-sentiment-withSentAndVol-300',


        '[unprovenFilter30Drops]',
        '[unprovenFilter30Drops]',
        '[unprovenFilter30Drops]',
        '[sepPerfectosMissing]',
        '[myRecs-day3count2to4-slice16-uniq-hundredWithHundredCheck]',
        '[myRecs-day15count9-hundredUpTrendsAllGt1]',
        '[postMongo]',
        '[spm-52day-bestFirstGreenAvgTrend-slice16]',
        '[spm-52day-bestAvgTrendAnyPlayout-slice16]',
        '[sepPerfectosLowerCounts]',
        '[unprovenSuddenDropsLast2Filter10]',
        '[spm-52day-highestLimitPlayoutsHundredResult-slice16-uniq]',
        '[sepPerfectos]',
        '[moreCommonDrops]',
        '[unprovenFilter20Drops]',
        '[heavydutyhitters]',
        '[myRecs-day15count5-hundredUpTrendsAllGt1]',
        '[myRecs-day3count2to4-uniq-hundredWithHundredCheck]',
        '[postMongoTimes2]',
        '[sepPerfectosLowerCounts]',
        '[sepStars]',
        '[myRecs-day3count2to4-slice16-uniq-hundredUpTrendsAllGt1]',
        '[tiptop-minCount4]',
        '[spm-52day-highestLimitPlayoutsJohnsSecretRecipeWithCount-slice16]',
        '[spm-52day-customCount3to5MagicScore-slice16-uniq]',


        // creme

        '[unprovenFilter30Drops]',
        '[sepAdds]',
        '[unprovenSuddenDropsLast2Filter10]',
        '[heavydutyhitters]',

        '[spm-52day-bestFirstGreenAvgTrend-slice16-uniq]',
        '[spm-52day-bestAvgTrendAnyPlayout-slice16-uniq]',
        '[spm-52day-all-slice16-uniq]',
        '[spm-52day-highestLimitPlayoutsJohnsSecretRecipeWithCount]',

        '[myRecs-day3count2to4-slice16-uniq-hundredUpAvgGt4]',
        '[myRecs-day20-hundredResultCreme]',
        '[myRecs-day15count5-hundredWithHundredCheck]',
        '[myRecs-day15count5-hundredUpAvgGt4]',
        '[myRecs-day3count2to4-slice16-uniq-hundredUpAvgGt4]',
        
        '[top-performers-topPerformers95-uniq]',
        '[top-performers-brainPredictions-uniq]',
        '[top-performers-myPredictions-uniq]',
        '[top-performers-sortedByHundredResult-uniq]',
        '[top-performers-sortedByPercUp-uniq]',

        

        '[tickerWatchers]',
        '[tickerWatchers]',
        '[tickerWatchers]',
        '[tickerWatchers]',
        
        '[simpleAsThat]',
        '[simpleAsThat]',
        '[simpleAsThat]',





        // modern picks // deleting because bad pm review :(
            // '[postMongoBigHitters]',
            // '[postMongoTimes2]',
            // '[dec17]',
            // '[postMongoCount3]', 

        // old timers thanks to pm analysis
            
        // drops
            // '[filteredDrops]',
            // '[moreCommonDrops]',
            // '[moreCommonDrops]',
            // '[unprovenSuddenDropsLast2Filter10]',
            // '[unprovenSuddenDropsLast2Filter10]',

            // '[unprovenFilter30Drops]',
            // '[unprovenFilter30Drops]',
            // '[unprovenFilter30Drops]',
            // '[unprovenFilter30Drops]',

            // '[unprovenFilter20Drops]',
            // '[unprovenFilter20Drops]',
            // '[unprovenFilter20Drops]',

        // september
            // '[sepAdds]',
            // '[sepHighlights]',
            // '[sepStars]',
            // '[sepPerfectosMissing]',
            // '[sepPerfectosLowerCounts]',

        
        // more manuals
            // '[hadAGoodDay]',
        
        // my-recs
            // '[myRecs-day1-whileLoopCreme]',
            // '[myRecs-day7count3-hundredWithHundredCheck]',          /// ??????
            // '[myRecs-day10count5-hundredUpAvgGt4]',
            // '[myRecs-day10count5-hundredUpAvgGt4]',                 /// ??????
            // '[myRecs-day5count4-uniq-hundredUpPicks]',
            // '[myRecs-day3count2to4-slice16-uniq-hundredUpAvgGt4]',
            // '[myRecs-day3count2-slice16-uniq-hundredWithHundredCheck]',
            // '[myRecs-day3count2-uniq-hundredWithHundredCheck]',
            // '[myRecs-day20-hundredResultCreme]',

        // spm's
            // '[spm-52day-all-slice16-uniq]',
            // '[spm-52day-bestAvgTrendAnyPlayout-slice16-uniq]',
            // '[spm-52day-bestAvgTrendAnyPlayout-slice16-uniq]',
            // '[spm-52day-bestAvgTrendAnyPlayout-slice16-uniq]',
            // '[spm-52day-highLimitPlayoutsAvgTrend-slice16]',        /// ??????
            // '[spm-52day-bestFirstGreenAvgTrend-slice16-uniq]',      /// ??????
            // '[spm-52day-bestFirstGreenAvgTrend-slice16-uniq]',
            // '[spm-52day-bestAvgTrendPlayoutsOfInterest]',
            // '[spm-52day-highestLimitPlayoutsAvgTrend-slice16-uniq]',
            // '[spm-52day-highestLimitPlayoutsJohnsSecretRecipe-slice16-uniq]',
            // '[spm-52day-highestLimitPlayoutsJohnsSecretRecipe-slice16-uniq]',
            // '[spm-52day-highestLimitPlayoutsJohnsSecretRecipeWithCount-slice16-uniq]',
            // '[spm-52day-customCount8to11MagicScore-slice16-uniq]',
            // '[spm-52day-middleCountsJohnsRecipe-slice16-uniq]',
            // '[spm-52day-limit5creme-slice16',
            // '[spm-52day-bestAlwaysLastAvgTrend-slice16-uniq]',
            // '[spm-52day-anyCountPerfectos]',

        // top performers
            // '[top-performers-myPredictions-uniq]',
            // '[top-performers-brainPredictions-uniq]',
            // '[top-performers-topPerformers95-uniq]',
            // '[top-performers-sortedByAvgTrend-uniq]',

        // tiptop
            // '[tiptop-minCount4]',
            // '[tiptop-minCount4]',
    ],
    // forPurchaseVariation: '80Perc5Day-notincludingblanks',
    fallbackSellStrategy: 'limit3',
    disableMultipliers: false,
    force: {
        sell: [
            // 'FIHD'
        ],
        keep: [
            // 'NSPR',
            // 'BOXL',
            // 'SEII',
            // 'AWX'
            // 'ESES'
        ]
    }
};
