const simpleBuy = require('./simple-buy');
const alpacaMarketBuy = require('../alpaca/market-buy');
const alpacaLimitBuy = require('../alpaca/limit-buy');
const mapLimit = require('promise-map-limit');
const sendEmail = require('../utils/send-email');
const lookup = require('../utils/lookup');
const Holds = require('../models/Holds');
const { alpaca } = require('../alpaca');
const getBalance = require('../alpaca/get-balance');

module.exports = async ({
    totalAmtToSpend, 
    strategy, 
    maxNumStocksToPurchase, 
    min, 
    withPrices,
} = {}) => {

    let stocksToBuy = withPrices.map(obj => obj.ticker);
    // you cant attempt to purchase more stocks than you passed in
    // console.log(maxNumStocksToPurchase, 'numstockstopurchase', stocksToBuy.length);
    maxNumStocksToPurchase = maxNumStocksToPurchase ? Math.min(stocksToBuy.length, maxNumStocksToPurchase) : stocksToBuy.length;

    let numPurchased = 0;

    // randomize the order
    stocksToBuy = stocksToBuy.sort(() => Math.random() > Math.random());
    let amtToSpendLeft = totalAmtToSpend;
    let failedStocks = [];


    await mapLimit(stocksToBuy, 3, async ticker => {       // 3 buys at a time

        const perStock = totalAmtToSpend;

        // dont buy stocks if more than 40 percent of current balance!
        let percOfBalance = 0;
        try {
            const currentValue = (await alpaca.getPosition(ticker)).market_value;
            const balance = await getBalance();
            percOfBalance = currentValue / balance * 100;
        } catch (e) {}
        if (percOfBalance > 40) {
            return console.log(`NOT PURCHASING ${ticker} because ${percOfBalance}% of balance`);
        }
        console.log({ percOfBalance, ticker })

        // for now same amt each stock
        //amtToSpendLeft / (maxNumStocksToPurchase - numPurchased);
        console.log(perStock, 'purchasng ', ticker);
        try {
            const pickPrice = (withPrices.find(obj => obj.ticker === ticker) || {}).price;
            const quantity = Math.round(perStock / pickPrice / 4) || 1;

            const attemptPromises = [
                alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 1.02,
                    timeoutSeconds: 60 * 5,
                    fallbackToMarket: false
                }),
                alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 1.01,
                    timeoutSeconds: 60 * 5,
                    fallbackToMarket: false
                }),
                alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 1,
                    timeoutSeconds: 60 * 5,
                    fallbackToMarket: false
                }),
                alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 0.99,
                    timeoutSeconds: 60 * 5,
                    fallbackToMarket: false
                }),
                alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 0.98,
                    timeoutSeconds: 60 * 5,
                    fallbackToMarket: false
                }),
                alpacaMarketBuy({
                    ticker,
                    quantity,
                })
            ];
            await Promise.all(
                attemptPromises
            );


            numPurchased++;
        } catch (e) {
            // failed
            failedStocks.push(ticker);
            console.log('failed purchase for ', ticker, e);
        }
    });

    // console.log('finished purchasing', stocksToBuy.length, 'stocks');
    // console.log('attempted amount', totalAmtToSpend);
    // // console.log('amount leftover', amtToSpendLeft);
    // if (failedStocks.length) {
    //     await sendEmail(`failed to purchase`, JSON.stringify(failedStocks));
    // }
};
