const getTrend = require('../utils/get-trend');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

const executeStrategy = require('../app-actions/execute-strategy');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const addOvernightJump = require('../app-actions/add-overnight-jump');

const mapLimit = require('promise-map-limit');

const trendFilter = async (Robinhood, trend) => {

    trend = await addOvernightJump(Robinhood, trend);

    let allHistoricals = await getMultipleHistoricals(
        Robinhood,
        trend.map(buy => buy.ticker)
    );

    let withHistoricals = trend
        .map((buy, i) => ({
            ...buy,
            historicals: allHistoricals[i]
        }))
        .filter(({historicals}) => historicals.length);


    const analyzeTrend = (trend) => {
        console.log('running analyze')
        const ofInterest = trend
            .filter(({mostRecentTrend}) => mostRecentTrend < -3)
            .map(buy => {
                let daysUp = [];
                buy.historicals.some(hist => {
                    const wentUp = hist.trend > 0;
                    daysUp.push(hist);
                    return !wentUp;
                });
                delete buy.historicals;
                delete buy.fundamentals;
                delete buy.quote_data;
                const daysUpCount = daysUp.length - 1;
                if (daysUpCount) {
                    try {
                        var percUp = getTrend(daysUp[0].close_price, daysUp[daysUp.length - 1].close_price);
                        var points = daysUpCount * percUp * Math.abs(buy.mostRecentTrend);
                    } catch (e) {}
                }
                return {
                    ...buy,
                    daysUpCount,
                    daysUp,
                    percUp,
                    points
                };
            })
            .filter(buy => buy.daysUpCount > 2 && buy.percUp > Math.abs(buy.mostRecentTrend) && buy.points > 200)
            .sort((a, b) => b.points - a.points)
            .slice(0, 5);


        // console.log(JSON.stringify(ofInterest, null, 2));

        return ofInterest
            .map(({ ticker }) => ticker);
    };


    return {
        prevClose: analyzeTrend(
            withHistoricals
                // .slice()
                .map(buy => ({
                    ...buy,
                    historicals: buy.historicals.reverse(),
                    mostRecentTrend: buy.trend_since_prev_close
                }))
        ),
        prevCloseWithoutDowntrending: analyzeTrend(
            withHistoricals
                // .slice()
                .filter(buy => buy.trend_since_prev_close < 0)
                .map(buy => ({
                    ...buy,
                    historicals: buy.historicals.reverse(),
                    mostRecentTrend: buy.trend_since_prev_close
                }))
        ),
        shiftedHist: analyzeTrend(
            withHistoricals
                .map(buy => {
                    // console.log(buy.mostRecentTrend, 'does it exist already');
                    const {historicals} = buy;
                    // evening
                    const {trend: mostRecentHistorical} = historicals.shift();
                    // console.log('most recent trend...', mostRecentHistorical);
                    return {
                        ...buy,
                        mostRecentTrend: mostRecentHistorical,
                    };
                })
        )
    }

};


const upsThenDowns = {
    trendFilter,
    init: (Robinhood) => {

        // runs at init
        regCronIncAfterSixThirty(
            Robinhood,
            {
                name: 'execute ups-then-downs strategy',
                run: [10, 50, 200, 300, 380, 600],
                // run: [],
                fn: (Robinhood, min) => setTimeout(async () => {
                    await executeStrategy(Robinhood, trendFilter, min, 0.3, 'ups-then-downs');
                }, 5000)
            },
        );

    }
};


module.exports = upsThenDowns;
