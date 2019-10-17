const simpleBuy = require('./simple-buy');

const alpacaMarketBuy = require('../alpaca/market-buy');
const alpacaLimitBuy = require('../alpaca/limit-buy');
const alpacaAttemptBuy = require('../alpaca/attempt-buy');

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
            const quantity = Math.round(perStock / pickPrice / 3) || 1;

            const buyStyles = {
                limit: alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 1.03,
                    timeoutSeconds: 60 * 5,
                    fallbackToMarket: false
                }),
                market: alpacaMarketBuy({
                    ticker,
                    quantity,
                }),
                attempt: alpacaAttemptBuy({
                    ticker,
                    quantity,
                    pickPrice
                })
            };
            
            const buyPromises = Object.entries(buyStyles).map(
                async ([name, promise]) => {
                    strlog({
                        name,
                        promise
                    })
                    const response = await promise;
                    const order = response && response.alpacaOrder ? response.alpacaOrder : response;
                    return {
                        name,
                        filledAt: (order || {}).filled_at
                    };
                }
            );

        

            const roundUp = await Promise.all(
                buyPromises
            );

            await sendEmail(`roundup for ${ticker} buy`, JSON.stringify(roundUp, null, 2))


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
