// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 200,
    forPurchase: [
        // '[kst-optionszeroCrosses30Min]',
        // '[rsi-10minlt5]',
        // '[rsi-5minlt15]',
        // '[smooth-kst-zeroCrosses]',
        // '[kst-top100LowSignals10min]',
        // '[ema-bullishCross10min]',
        // '[sma-bullishCross30min]',
        '[sudden-drops]',
        '[lessthan5fitty]',
        '[lessthan10fitty]',
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
