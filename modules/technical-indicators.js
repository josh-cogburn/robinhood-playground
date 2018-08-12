// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const getTrend = require('../utils/get-trend');

const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const executeStrategy = require('../app-actions/execute-strategy');
const addOvernightJump = require('../app-actions/add-overnight-jump');

const mapLimit = require('promise-map-limit');
const { OBV, SMA, isTrendingUp } = require('technicalindicators');

const trendFilter = async (Robinhood, trend) => {

    // add overnight jump
    console.log('adding overnight jump')
    const withOvernightJump = await addOvernightJump(Robinhood, trend);
    console.log('done adding overnight jump')


    const top50Volume = withOvernightJump.sort((a, b) => {
        return b.fundamentals.volume - a.fundamentals.volume;
    }).slice(0, 50);

    // add historical data
    let allHistoricals = await getMultipleHistoricals(
        Robinhood,
        top50Volume.map(buy => buy.ticker),
        `interval=10minute&span=week`
    );

    let withHistoricals = top50Volume.map((buy, i) => ({
        ...buy,
        historicals: allHistoricals[i]
    }));

    // console.log(JSON.stringify(withHistoricals, null, 2));

    let withTechnicalIndicators = withHistoricals.map((buy, i) => {

        const { historicals } = buy;
        historicals.pop();
        // console.log(historicals, 'historicals')

        const OBVobject = ['close:close_price', 'volume'].reduce((acc, val) => {
            let [objKey, historicalKey] = val.split(':');
            if (!historicalKey) historicalKey = objKey;
            // console.log(historicalKey, objKey)
            return {
                [objKey]: historicals.map(hist => hist[historicalKey]),
                ...acc
            };
        }, {});

        const SMAobject = {
            period: 8,
            values: historicals.map(hist => hist.close_price)
        };


        // console.log(OBVobject);
        return {
            OBV: OBV.calculate(OBVobject),
            SMA: SMA.calculate(SMAobject),
            // isTrendingUp: await isTrendingUp({ values: historicals.map(hist => hist.close_price) }),
            ...buy,
        };
    });

    // const onlyBasics = withTechnicalIndicators.map(buy => {
    //     [
    //         'historicals',
    //         'quote_data',
    //     ].forEach(key => {
    //         delete buy[key];
    //     });
    //     return buy;
    // });

    const withBooleans = withTechnicalIndicators.map(buy => {
        const { SMA, historicals } = buy;
        const mostRecentSMA = SMA[SMA.length - 1];
        return {
            ...buy,
            priceToSMA: getTrend(mostRecentSMA, buy.last_trade_price),
            SMAoverUnder: SMA.map((avg, index) => {
                const relHist = historicals[index];
                // return relHist.close_price > avg;
                return getTrend(avg, relHist.close_price);
            })
        }
    });

    const withSMAcrossovers = withBooleans.map(buy => {
        return {
            ...buy,
            SMAcrossovers: (() => {
                let underCount = 0;
                const pricesAtCrossover = [];
                buy.SMAoverUnder.forEach((trend, index) => {
                    const isOver = trend > 0;
                    if (!isOver) {
                        underCount++;
                    } else {
                        if (underCount > 5) {
                            pricesAtCrossover.push({
                                trend: getTrend(
                                    buy.historicals[index + 1].open_price,
                                    buy.historicals[index + 2].close_price,
                                ),
                                index
                            });
                        }
                        underCount = 0;
                    }
                });
                return pricesAtCrossover;
            })()
        };
    });

    const getTopSMAoverUnder = (arr, index) => {
        const sortedBySMAoverUnder = arr.sort((a, b) => {
            return b.SMAoverUnder[index] - a.SMAoverUnder[index];
        });
        // console.log(sortedBySMAoverUnder, 'sorted');
        const topSMAoverUnder = sortedBySMAoverUnder[0];
        return topSMAoverUnder;
    };


    const singleBestSMAs = withSMAcrossovers[0].historicals.map((_, index) => {
        const topSMAoverUnder = getTopSMAoverUnder(withSMAcrossovers, index);
        if (!topSMAoverUnder) {
            return null;
        }
        return {
            ticker: topSMAoverUnder.ticker,
            winningSMA: topSMAoverUnder.SMAoverUnder[index],
            price: topSMAoverUnder.historicals[index].close_price,
            ...(topSMAoverUnder.historicals[index+1] && {
                trend: getTrend(
                    topSMAoverUnder.historicals[index+1].close_price,
                    topSMAoverUnder.historicals[index].close_price
                )
            }),
            trendToEOD: getTrend(
                topSMAoverUnder.historicals[topSMAoverUnder.historicals.length - 1].close_price,
                topSMAoverUnder.historicals[index].close_price
            )
        };
    });

    const topSMAoverUnderLastTrade = withBooleans.sort((a, b) => {
        return b.priceToSMA - a.priceToSMA;
    })[0];

    const topOBV = withBooleans.sort((a, b) => {
        return b.OBV[b.OBV.length - 1] - a.OBV[a.OBV.length - 1];
    })[0];

    // console.log(JSON.stringify(withSMAcrossovers, null, 2));


    const withCrossoverRecently = (() => {
        const numHistoricals = withSMAcrossovers[0].historicals.length;
        console.log(numHistoricals, 'numHistoricals')
        const foundCrossoverRecently = withSMAcrossovers.filter(buy => {
            const foundCrossover = buy.SMAcrossovers.find(crossover => {
                console.log(crossover.index, numHistoricals.length - 30);
                return crossover.index >= numHistoricals - 5
            });
            return !!foundCrossover;
        });
        return foundCrossoverRecently ? foundCrossoverRecently.map(buy => buy.ticker) : null;
    })();

    // console.log(JSON.stringify(singleBestSMAs, null, 2));
    // const

    return {
        topSMAoverUnderHist: [singleBestSMAs[singleBestSMAs.length - 1].ticker],
        topSMAoverUnderLastTrade: [topSMAoverUnderLastTrade.ticker],
        withCrossoverMostRecentHist: withCrossoverRecently,
        topOBV: [topOBV.ticker]
    };
};

const swings = {
    trendFilter,
    init: Robinhood => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'execute technical indicators',
            run: [193, 253], // 10:41am, 11:31am
            // run: [],
            fn: async (Robinhood, min) => {
                await executeStrategy(Robinhood, trendFilter, min, 0.3, 'swings');
            }
        });
    }
};

module.exports = swings;
