// take in a series of breakdowns
// and returns the value at which the stock would be sold
// returns an object of functions that called for each value of the breakdowns
const {
    avgArray,
    percUp,
    hundredResult
} = require('../../utils/array-math');

const playoutGenerator = (individualFn, arrFn) => arr => {

    const outcomes = arr.map(breakdowns => {
        if (arrFn) return { value: arrFn(breakdowns) };
        for (let i = 0; i < breakdowns.length; i++) {
            const b = breakdowns[i];
            if (individualFn(b, i, breakdowns)) {
                return {
                    hitFn: true,
                    value: b
                };
            }
        }
        return {
            hitFn: false,
            value: breakdowns[breakdowns.length - 1]
        };
    });

    // console.log(outcomes, 'out');

    const onlyValues = outcomes
        .map(o => o.value)
        .filter(v => Math.abs(v) < 50);
    const onlyHits = outcomes.filter(o => o.hitFn);

    return {
        percUp: percUp(onlyValues),
        avgTrend: avgArray(onlyValues),
        hundredResult: hundredResult(onlyValues),
        ...(individualFn && {
            percHitPlayout: onlyHits.length / outcomes.length,
            percHitsPositive: onlyHits.filter(o => o.value > 0).length / onlyHits.length,
        }),
        // onlyValues: onlyValues.join(', ')
    };

};
const limitPlayout = limit => playoutGenerator(v => Math.abs(v) > limit);
const limitDownUp = (down, up) => playoutGenerator(v =>
    v <= 0 - down || v >= up
);
const limitUp = limit => playoutGenerator(v => v >= limit);

const limitPerms = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
const downUpPerms = [
    [10, 5],
    [5, 10],
    [6, 4],
    [3, 6],
    [2, 5],
    [6, 12],
    [6, 3],
    [10, 3]
];
const upPerms = [1, 2, 3, 4, 5, 6];


const playouts = {

    ...limitPerms.reduce((acc, limit) => ({
        ...acc,
        [`limit${limit}`]: limitPlayout(limit)
    }), {}),

    ...downUpPerms.reduce((acc, [down, up]) => ({
        ...acc,
        [`limit${down}Down${up}Up`]: limitDownUp(down, up)
    }), {}),

    ...upPerms.reduce((acc, up) => ({
        ...acc,
        [`limitUp${up}`]: limitUp(up)
    }), {}),

    firstGreen: limitUp(0.3),

    upTwoSinceLast: playoutGenerator((v, i, breakdowns) => {
        const prevBreakdown = breakdowns[i - 1];
        if (!prevBreakdown) return false;
        return v > prevBreakdown + 2;
    }),

    alwaysLast: playoutGenerator(null, arr => arr[arr.length - 1]),
    onlyMax: playoutGenerator(null, arr => Math.max(...arr))
};

module.exports = playouts;
