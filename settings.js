// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 10,
    purchaseAmt: 40,
    forPurchase: [
        '[feb13bestst]',
        '[feb13tw]',
        '[feb13highvol]',
        '[feb13emacrossovers]',
        '[feb13singlebestst]',
        '[feb13singletw]',
        '[feb13singlenewhighs]',
        '[feb13singlehighvol]',


        '[stockInvest]',
        '[stockInvest]',
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
