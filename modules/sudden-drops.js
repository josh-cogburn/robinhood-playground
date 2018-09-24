// utils
const getTrend = require('../utils/get-trend');

// app-actions
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');

const trendFilter = async (Robinhood, trend, min) => {

    const isNotRegularTrading = min < 0 || min >= 390;
    let histQS = `interval=5minute`;
    if (isNotRegularTrading) histQS += '&bounds=extended';

    let allHistoricals = await getMultipleHistoricals(
        Robinhood,
        trend.map(buy => buy.ticker),
        histQS
    );

    let withHistoricals = trend.map((buy, i) => ({
        ...buy,
        historicals: allHistoricals[i]
    })).filter(buy => !!buy.historicals && buy.historicals.length);

    const perms = [1, 2, 3, 5, 10, 18, 30, 50];
    let withQuickTrends = withHistoricals
        .map(buy => {
            const lastClose = buy.historicals[buy.historicals.length - 1].close_price;
            return {
                ...buy,
                ...perms.reduce((acc, val) => {
                    const pastHistorical = buy.historicals[buy.historicals.length - val];
                    return {
                        ...acc,
                        ...pastHistorical && {
                            [`last${val}trend`]: getTrend(lastClose, pastHistorical.open_price)
                        }
                    };
                }, {})
            };
        });

    const mapTicks = trend => trend.map(buy => buy.ticker);
    const firstPerms = (lastVal, ofInterest) => ({
        [`last${lastVal}trend-first1`]: mapTicks(ofInterest.slice(0, 1)),
        [`last${lastVal}trend-first2`]: mapTicks(ofInterest.slice(0, 2)),

        [`last${lastVal}trend-filter10`]: mapTicks(
            ofInterest.filter(trend => trend[`last${lastVal}trend`] < -10)
        ),
        [`last${lastVal}trend-filter20`]: mapTicks(
            ofInterest.filter(trend => trend[`last${lastVal}trend`] < -20)
        ),
        [`last${lastVal}trend-filter30`]: mapTicks(
            ofInterest.filter(trend => trend[`last${lastVal}trend`] < -30)
        )
    });

    // console.log(
    //     JSON.stringify(
    //         withQuickTrends
    //             .map((trend) => {
    //                 delete trend.historicals;
    //                 return trend;
    //             }),
    //         null,
    //         2
    //     )
    // );
    return perms
        .filter(val => withQuickTrends.some(buy => !!buy[`last${val}trend`]))
        .reduce((acc, val) => ({
            ...acc,
            ...firstPerms(
                val,
                withQuickTrends
                    .sort((a, b) => a[`last${val}trend`] - b[`last${val}trend`])
            )
        }), {});


};

const suddenDrops = {
    name: 'sudden-drops',
    trendFilter,
    run: [-50, -30, -10, 3, 14, 32, 63, 100, 153, 189, 221, 280, 290, 328, 360, 388, 400, 430, 470, 500]
};

module.exports = suddenDrops;