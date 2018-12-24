const activeBuy = require('./active-buy');
const mapLimit = require('promise-map-limit');

module.exports = async (Robinhood, {stocksToBuy, totalAmtToSpend, strategy, maxNumStocksToPurchase, min }) => {

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
            const response = await activeBuy(Robinhood, {
                ticker: stock,
                maxPrice: perStock,
                strategy,
                min
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
    failedStocks.length && console.log('failed stocks', JSON.stringify(failedStocks));
};
