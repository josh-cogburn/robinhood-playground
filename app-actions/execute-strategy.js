// const cancelAllOrders = require('../rh-actions/cancel-all-orders');
const getTrendAndSave = require('./get-trend-and-save');
// const purchaseStocks = require('./purchase-stocks');
const recordPicks = require('./record-picks');

const multipleRuns = [
    askEqLastTrade: stock => 
        stock.quote_data.ask_price === stock.quote_data.last_trade_price 
        || stock.quote_data.ask_price === stock.quote_data.last_extended_hours_trade_price
];


const formatStock = stock => ({
    ...stock,
    
});

const executeStrategy = async (Robinhood, strategyFn, min, ratioToSpend, strategy, pricePermFilter) => {

    console.log('executing strategy', `${strategy}-${min}`);

    const trend = await getTrendAndSave(Robinhood, min + '*');

    let pricePerms = {
        under5: [0, 5],
        fiveTo10: [5, 10],
        tenTo15: [10, 15],
        fifteenTo20: [15, 20]
    };

    if (pricePermFilter) {
        Object.keys(pricePerms)
            .filter(priceKey => !pricePermFilter.includes(priceKey))
            .forEach(priceKey => {
                console.log('deleting', priceKey);
                delete pricePerms[priceKey];
            });
    }

    for (let priceKey of Object.keys(pricePerms)) {

        const [lowBounds, highBounds] = pricePerms[priceKey];
        const trendFilteredByPricePerm = trend.filter(stock => {
            return Number(stock.quote_data.last_trade_price) > lowBounds && Number(stock.quote_data.last_trade_price) <= highBounds;
        });
        const toPurchase = await strategyFn(Robinhood, trendFilteredByPricePerm, min);
        console.log(toPurchase, 'toPurchase');

        // gives ability to return an object from a trendFilter with multiple "variations"

        const priceFilterSuffix = (priceKey === 'under5') ? '' : `-${priceKey}`;
        await recordPicks(Robinhood, strategy, min, toPurchase, priceFilterSuffix);

    }


};

module.exports = executeStrategy;
