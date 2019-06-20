// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 40,
    forPurchase: [
        '[TWmajorJumpsNotWatchouts]',
        '[mySuperBoosters]',
        '[TWgoodLunch]',
        '[feb13singletw]',
        '[TWgoodLunch]',

        'high-volume-top100RH-volumeToAvg-60',
        'analytic-onlyUp-onj1to4AndTSOn5ton1-7-lightTrendScore-volatilityPick-4',
        'analytic-onlyUp-onjn1to1-30-lightTrendScore-periodTrendVolatilityPick-4',
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
