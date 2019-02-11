// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 100,
    forPurchase: [
        '[myTickerWatchers]',
        '[myStSents]',
        '[allEmaTrendingUp180SMA]',
        '[myEmaCrossoverWatchers]',

        '[highVolumePicks]',
        '[newHighPicks]',
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
