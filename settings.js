// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 200,
    forPurchase: [
        '[sudden-drops]',
        '[rsi-daily]',
        

        ...[ 'sep2019-rsi30',
        'sep2019-rsiDaily',
        'sep2019-rsi10',
        'sep2019-pennyscans',
        'sep2019-smoothKST',
        'sep2019-ema',
        'sep2019-macd' ].map(w => `[${w}]`)
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
