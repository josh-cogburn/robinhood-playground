const simpleBuy = require('./simple-buy');
const alpacaMarketBuy = require('../alpaca/market-buy');
const alpacaLimitBuy = require('../alpaca/limit-buy');
const mapLimit = require('promise-map-limit');
const sendEmail = require('../utils/send-email');
const lookup = require('../utils/lookup');
const Holds = require('../models/Holds');


module.exports = async ({ 
    stocksToBuy, 
    totalAmtToSpend, 
    strategy, 
    maxNumStocksToPurchase, 
    min, 
    withPrices,
    PickDoc
}) => {

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
        // for now same amt each stock
        //amtToSpendLeft / (maxNumStocksToPurchase - numPurchased);
        console.log(perStock, 'purchasng ', ticker);
        try {
            const pickPrice = (withPrices.find(obj => obj.ticker === ticker) || {}).price;
            const quantity = Math.floor(perStock / pickPrice / 2) || 1;


            const responses = await Promise.all([
                alpacaLimitBuy({
                    ticker,
                    quantity,
                    limitPrice: pickPrice * 1.07,
                }),
                alpacaMarketBuy({
                    ticker,
                    quantity,
                })
            ]);

            for (let response of responses) {
                strlog({ response })
                const alpacaOrder = response || {};
                if (alpacaOrder && alpacaOrder.filled_at) {
                    await Holds.registerAlpacaFill({
                        ticker,
                        alpacaOrder,
                        strategy,
                        PickDoc,
                        data: {
                            // attemptNum,
                        }
                    });
                } else {
                    console.log('failed to buy', ticker);
                }
            }
            

            // const response = await simpleBuy({
            //     ticker: stock,
            //     strategy,
            //     min,
            //     pickPrice,
            //     // quantity,
            //     maxPrice: perStock
            // });
            // console.log('success active buy', stock);
            // console.log('response from limit buy multiple', response);
            // amtToSpendLeft -= perStock;
            numPurchased++;
        } catch (e) {
            // failed
            failedStocks.push(ticker);
            console.log('failed purchase for ', ticker, e);
        }
    });

    console.log('finished purchasing', stocksToBuy.length, 'stocks');
    console.log('attempted amount', totalAmtToSpend);
    // console.log('amount leftover', amtToSpendLeft);
    if (failedStocks.length) {
        await sendEmail(`failed to purchase`, JSON.stringify(failedStocks));
    }
};
