// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 200,
    forPurchase: [
        '[sudden-drops]',
        // '[rsi-daily]',
        

        ...[ 
            'rsi30',
            'rsiDaily',
            'rsi10',
            'pennyscans',
            'smoothKST',
            'ema',
            'macd' 
        ].map(w => `[sep2019-${w}]`)

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
