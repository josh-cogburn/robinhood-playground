// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 40,
    forPurchase: [
        '[kst-optionszeroCrosses30Min]',
        '[kst-optionssignalCrossesislow30Min]',
        '[kst-upcomingZeroCrosses]',
        '[kst-upcomingLowSignals]',
        '[kst-top100LowSignals]',

        '[rsi-30minoptions]',
        '[rsi-10minoptions]',

        '[sudden-drops-majorJumpLunch]',
        '[sudden-drops-majorJumpDinner]',

        '[multi-hits]'
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
