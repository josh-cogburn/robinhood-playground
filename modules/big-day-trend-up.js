// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

// app-actions
const executeStrategy = require('../app-actions/execute-strategy');
const addTrendSinceOpen = require('../app-actions/add-trend-since-open');
// npm
const mapLimit = require('promise-map-limit');

// rh-actions
const getRisk = require('../rh-actions/get-risk');
// const trendingUp = require('../rh-actions/trending-up');

const trendFilter = async (Robinhood, trend) => {
    // cheap stocks that are going up the most for the day

    console.log('running big-day-trend-up strategy');

    console.log('total trend stocks', trend.length);
    const withTrendSinceOpen = await addTrendSinceOpen(Robinhood, trend);
    const allUp = withTrendSinceOpen.filter(
        stock => stock.trendSinceOpen && stock.trendSinceOpen > 3
    );
    console.log('trendingUp', allUp.length);


    let withDetails = await mapLimit(allUp, 20, async buy => ({
        ...buy,
        ...(await getRisk(Robinhood, buy.ticker)),
    }));

    console.log(
        'num watcout',
        withDetails.filter(buy => buy.shouldWatchout).length
    );
    console.log(
        '> 8% below max of year',
        withDetails.filter(buy => buy.percMax > -8).length
    );
    withDetails = withDetails.filter(
        buy => !buy.shouldWatchout && buy.percMax < -8
    );

    console.log('count', withDetails.length);
    const sorted = withDetails
        .sort((a, b) => b.trendSinceOpen - a.trendSinceOpen);

    const num = n => sorted
        .slice(0, n)    // top five trending up
        .map(stock => stock.ticker);

    return {
        count5: num(5),
        count2: num(2),
        count1: num(1)
    };
};

const bigDayTrendUp = {
    trendFilter,
    init: Robinhood => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'execute big-day-trend-up strategy',
            run: [10, 35, 90, 223], // 10:41am, 11:31am
            // run: [],
            fn: async (Robinhood, min) => {
                await executeStrategy(Robinhood, trendFilter, min, 0.3, 'big-day-trend-up');
            }
        });
    }
};

module.exports = bigDayTrendUp;
