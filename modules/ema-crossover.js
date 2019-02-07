const _ = require('underscore');

// utils
const getTrend = require('../utils/get-trend');

// app-actions
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const addOvernightJumpAndTSO = require('../app-actions/add-overnight-jump-and-tso');

// npm
const mapLimit = require('promise-map-limit');
const { SMA, EMA } = require('technicalindicators');


const trendFilter = async (Robinhood, trend) => {
    // add overnight jump
    console.log('adding overnight jump', Robinhood, trend)
    const withOvernightJump = await addOvernightJumpAndTSO(Robinhood, trend);
    console.log('done adding overnight jump')


    const top50Volume = withOvernightJump.sort((a, b) => {
        return b.fundamentals.volume - a.fundamentals.volume;
    }).slice(0, 150);


    const addTrendWithHistoricals = async (trend, interval, span) => {
        // add historical data
        let allHistoricals = await getMultipleHistoricals(
            Robinhood,
            trend.map(buy => buy.ticker),
            `interval=${interval}&span=${span}`
        );

        let withHistoricals = trend.map((buy, i) => ({
            ...buy,
            [`${span}Historicals`]: allHistoricals[i]
        }));

        return withHistoricals;
    };

    
    const trendWithYearHist = await addTrendWithHistoricals(top50Volume, 'day', 'year');
    const trendWithDayHist = await addTrendWithHistoricals(trendWithYearHist, '5minute', 'day');

    const calcEMA = (period, obj, lastVal) => {
        const array = EMA.calculate({
            period,
            values: [
                ...obj.yearHistoricals.map(hist => hist.close_price),
                ...lastVal ? [Number(lastVal)] : []
            ]
        });
        return array.pop();
    };
    const smaTrendingUp = (obj, lastVal) => {
        const array = SMA.calculate({
            period: 180,
            values: [
                ...obj.yearHistoricals.map(hist => hist.close_price),
                ...lastVal ? [Number(lastVal)] : []
            ]
        });
        const fiveDaysAgo = array[array.length - 6];
        const recent = array[array.length - 1];
        return recent > fiveDaysAgo;
    };
    const withEMA = trendWithDayHist.map(o => ({
        ...o,
        sma180trendingUp: smaTrendingUp(o, o.fundamentals.open),
        open: {
            ema35: calcEMA(35, o, o.fundamentals.open),
            ema5: calcEMA(5, o, o.fundamentals.open),
        },
        close: {
            ema35: calcEMA(35, o, o.last_trade_price),
            ema5: calcEMA(5, o, o.last_trade_price),
        }
    }));

    const startingBelow35Ema = withEMA.filter(o => 
        o.open.ema5 < o.open.ema35
    );

    const withCrossedEma = startingBelow35Ema.map(o => {
        let crossedAt;
        const crossed = o.dayHistoricals.some(hist => {
            const new5dayEma = calcEMA(5, o, hist.close_price);
            const crossed = new5dayEma  > o.open.ema35;
            if (crossed) crossedAt = hist.close_price;
            return crossed;
        });
        return {
            ...o,
            crossed,
            crossedAt
        };
    });

    const withTrendFromCross = withCrossedEma
        .filter(o => o.crossed)
        .map(o => ({
            ...o,
            trendFromCross: getTrend(o.last_trade_price, o.crossedAt)
        }));

    str({ withTrendFromCross: withTrendFromCross.map(o => _.pick(o, ['ticker', 'sma180trendingUp', 'crossed', 'crossedAt', 'trendFromCross'])) });
    str(withTrendFromCross.length)

};

const emaCrossover = {
    name: 'ema-crossover',
    trendFilter,
    // run: [12, 190, 250, 600, -15],
};

module.exports = emaCrossover;
