const simpleBuy = require('./simple-buy');
const alpacaMarketBuy = require('../alpaca/market-buy');
const mapLimit = require('promise-map-limit');
const sendEmail = require('../utils/send-email');

module.exports = async (Robinhood, {stocksToBuy, totalAmtToSpend, strategy, maxNumStocksToPurchase, min, withPrices }) => {

    // you cant attempt to purchase more stocks than you passed in
    // console.log(maxNumStocksToPurchase, 'numstockstopurchase', stocksToBuy.length);
    maxNumStocksToPurchase = maxNumStocksToPurchase ? Math.min(stocksToBuy.length, maxNumStocksToPurchase) : stocksToBuy.length;

    let numPurchased = 0;

    // randomize the order
    stocksToBuy = stocksToBuy.sort(() => Math.random() > Math.random());
    let amtToSpendLeft = totalAmtToSpend;
    let failedStocks = [];

    await mapLimit(stocksToBuy, 3, async stock => {       // 3 buys at a time
        const perStock = amtToSpendLeft / (maxNumStocksToPurchase - numPurchased);
        console.log(perStock, 'purchasng ', stock);
        try {
            const pickPrice = (withPrices.find(obj => obj.ticker === stock) || {}).price;

            // queue alpaca limit order 4% above pickPrice
            const alpacaQuantity = Math.floor(perStock / pickPrice);
            await alpacaMarketBuy(stock, alpacaQuantity);

            const response = await simpleBuy(Robinhood, {
                ticker: stock,
                maxPrice: perStock,
                strategy,
                min,
                pickPrice
            });
            console.log('success active buy', stock);
            // console.log('response from limit buy multiple', response);
            amtToSpendLeft -= perStock;
            numPurchased++;
        } catch (e) {
            // failed
            failedStocks.push(stock);
            console.log('failed purchase for ', stock);
        }
    });

    console.log('finished purchasing', stocksToBuy.length, 'stocks');
    console.log('attempted amount', totalAmtToSpend);
    console.log('amount leftover', amtToSpendLeft);
    if (failedStocks.length) {
        await sendEmail(`robinhood-playground: failed to purchase`, JSON.stringify(failedStocks));
    }
};
