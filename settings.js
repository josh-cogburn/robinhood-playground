// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 2,
    purchaseAmt: 220,
    forPurchase: [
        '[myTickerWatchers]'
    ],
    // forPurchaseVariation: '75Perc5Day-yesincludingblanks',
    fallbackSellStrategy: 'limit8',
    disableMultipliers: false,
    force: {
        sell: [
            // 'FIHD'
        ],
        keep: [
            // 'HSGX'
            // 'NSPR',
            // 'BOXL',
            // 'SEII',
            // 'AWX'
            // 'ESES'
        ]
    }
};
