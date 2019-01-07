// const cancelAllOrders = require('../rh-actions/cancel-all-orders');
const getTrendAndSave = require('./get-trend-and-save');
// const purchaseStocks = require('./purchase-stocks');
const recordPicks = require('./record-picks');

const GOLDEN_VARIATIONS = [
    // {
    //     name: 'askEqLastTrade',
    //     stockFilter: stock => 
    //         stock.quote_data.askPrice === stock.quote_data.lastTrade 
    //         || stock.quote_data.askPrice === stock.quote_data.afterHoursPrice
    // },
    // {
    //     name: 'trendingUpGt2SincePrevClose',
    //     stockFilter: stock => stock.trend_since_prev_close > 2
    // },
    // {
    //     name: 'trendingDown2SincePrevClose',
    //     stockFilter: stock => stock.trend_since_prev_close < -2
    // }
];

const executeStrategy = async (Robinhood, strategyFn, min, ratioToSpend, strategy, pricePermFilter) => {

    const executeSingleStrategy = async (trend, strategyName, priceKey) => {
        const toPurchase = await strategyFn(Robinhood, trend, min, priceKey);
        // console.log('strategyName', strategyName);
        // console.log('toPurchase', toPurchase);

        // gives ability to return an object from a trendFilter with multiple "variations"
        const priceFilterSuffix = (priceKey === 'under5') ? '' : `-${priceKey}`;
        await recordPicks(Robinhood, strategyName, min, toPurchase, priceFilterSuffix);
    };

    const runAllGoldenVariations = async (filteredByPrice, priceFilterSuffix) => {
        for (let variation of GOLDEN_VARIATIONS) {
            const { name, stockFilter } = variation;
            await executeSingleStrategy(
                filteredByPrice.filter(stockFilter),
                `${strategy}-${name}`,
                priceFilterSuffix
            );
        };
    };

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
            return stock.quote_data.lastTrade > lowBounds && stock.quote_data.lastTrade <= highBounds;
        });

        await executeSingleStrategy(    // first execute the strategy without any golden variations filtering
            trendFilteredByPricePerm,
            strategy,
            priceKey
        );
        await runAllGoldenVariations(   // then run all golden variations (exponential power!)
            trendFilteredByPricePerm,
            priceKey
        );
        

    }


};

module.exports = executeStrategy;
