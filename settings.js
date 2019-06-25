// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 40,
    forPurchase: [
        '[TWmajorJumpsNotWatchouts]',
        '[TWgoodLunch]',
        '[feb13singletw]',
        '[TWgoodDinner]',
        '[feb13tw]',
        '[myAddOns]',
        '[myLaters]',
        '[tenAndFifteenLaters]',
        '[allRSIwatchers]',
        '[allKSTwatchers]',
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
