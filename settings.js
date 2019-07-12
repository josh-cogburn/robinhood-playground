// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 40,
    forPurchase: [
        '[kst-top100ZeroCrosses30minUnder300]',
        '[rsi-rhtopunder300]',
        // '[stocktwits-mostBearish]',
        // '[rsi-shouldWatchout]',
        '[rsi-lessthan15]',
        '[rsi-top100under20]',
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
