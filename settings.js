// TODO: flatten list of strategies with PMs for emailObj same way as forPurchase
module.exports = {
    // important settings
    sellAllStocksOnNthDay: 2,
    purchaseAmt: 40,
    forPurchase: [
        '[postMongoBigHitters]',
        '[postMongoBigHitters]',
        '[postMongoBigHitters]',
        '[postMongoBigHitters]',
        
        '[postMongoTimes2]',
        '[postMongoTimes2]',
        '[dec17]',
        '[dec17]',

        '[postMongoCount3]',
    ],
    fallbackSellStrategy: 'limit3',
    force: {
        sell: [
            // 'FIHD'
        ],
        keep: [
            // 'NSPR',
            // 'BOXL',
            // 'SEII',
            // 'AWX'
        ]
    }
};
