const playoutsOfInterest = require('./one-off-scripts/playouts-of-interest');


const highestPlayoutFn = (
    playoutScoreFn,
    playoutFilter = 'limit'
) => ({
    count,
    playouts
}) => {
    let max = Number.NEGATIVE_INFINITY;
    let limitName;
    const playoutFilterFn = typeof playoutFilter === 'function'
        ? playoutFilter
        : key => key.includes(playoutFilter)
    Object.keys(playouts)
        .filter(playoutFilterFn)
        .forEach(key => {
            const val = playoutScoreFn(playouts[key], count);
            if (val > max) {
                max = val;
                limitName = key;
            }
        });
    return [max, limitName];    // returns the highest avgTrend limit
};

const analyzeRoundup = allRoundup => {
    // console.log('all round', JSON.stringify(allRoundup, null, 2))
    const createBreakdown = ({
        scoreFn = ({ count, playouts: { onlyMax: { percUp, avgTrend }}}) =>
            percUp * avgTrend * count,
        filterFn = () => true,
        includeAll = false,
        includePlayout,
    }) => {
        const filtered = allRoundup.filter(filterFn);
        const withScore = filtered.map(obj => {

            const scoreOutput = scoreFn(obj);
            let score;
            if (Array.isArray(scoreOutput)) {
                includePlayout = scoreOutput[1];
                score = scoreOutput[0];
            } else {
                score = scoreOutput;
            }

            obj = {
                ...obj,
                score
            };

            // remove playouts from obj
            if (includePlayout) {
                return {
                    ...obj,
                    playouts: {
                        [includePlayout]: obj.playouts[includePlayout]
                    }
                };
            } else {
                const { playouts, ...rest } = obj;
                return rest;
            }

        });
        console.log(withScore, 'withScore');
        const sorted = withScore.sort((a, b) => b.score - a.score);
        return includeAll ? sorted : sorted.slice(0, 15);
    };

    const maxCount = Math.max(...allRoundup.map(o => o.count));
    console.log(maxCount, 'maxCount');





    const lowCounts = ({ count }) => count <= maxCount / 2 && count >= 5;
    const upperHalfCounts = ({ count }) => count > maxCount / 2;
    const middleCounts = ({ count }) =>
        // 25% - 75%
        count > maxCount / 4 && count > 3 * maxCount / 4;

    return {
        all: createBreakdown({
            includeAll: true,
            includePlayout: 'onlyMax'
        }),
        // consistent: createBreakdown({
        //     // top 3 quarters
        //     filterFn: ({ count }) => count >= maxCount / 4,
        //     scoreFn: ({ count, percUp }) => (100 + count) * percUp
        // }),
        // creme: createBreakdown({        // top third count
        //     filterFn: ({ count }) => count > maxCount * 2 / 3,
        // }),
        // moderates: createBreakdown({
        //     minPercUp: 0.90,
        //     filterFn: ({ count }) =>    // middle third count
        //         count <= maxCount * 2 / 3
        //         && count > maxCount / 3,
        //     // dont take count into consideration
        //     scoreFn: ({ percUp, avgMax }) => percUp * avgMax
        // }),
        // occasionals: createBreakdown({  // bottom third count
        //     filterFn: ({ count }) => count <= maxCount / 3
        // }),

        limit5hundredResult: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: ({
                playouts: {
                    limit5: { hundredResult }
                }
            }) => hundredResult,
            includePlayout: 'limit5'
        }),

        limit5creme: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: ({
                count,
                playouts: {
                    limit5: { percUp, avgTrend }
                }
            }) => count * (percUp * 3) * avgTrend,
            includePlayout: 'limit5'
        }),

        highestLimitPlayoutsAvgTrend: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(playout => playout.avgTrend)
        }),

        highestLimitPlayoutsPercUp: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(playout => playout.percUp)
        }),

        highestLimitPlayoutsHundredResult: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(playout => playout.hundredResult)
        }),

        highestLimitPlayoutsPercUpCountAvg: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ percUp, avgTrend }, count) =>
                count * (percUp * 3) * avgTrend
            )
        }),

        highestLimitPlayoutsJohnsSecretRecipe: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }) =>
                hundredResult * (2 * percUp) * avgTrend * (2 * percHitsPositive)
            )
        }),

        highestLimitPlayoutsJohnsSecretRecipeWithCount: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                hundredResult * (2 * percUp) * avgTrend * (2 * percHitsPositive) * count
            )
        }),

        highestLimitPlayoutsAvgTrend: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                hundredResult * (2 * percUp) * avgTrend * (2 * percHitsPositive) * count
            )
        }),

        bestFirstGreenAvgTrend: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ avgTrend }) => avgTrend, 'firstGreen')
        }),

        bestAlwaysLastAvgTrend: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ avgTrend }) => avgTrend, 'alwaysLast')
        }),

        bestChangeGt2SinceLastAvgTrend: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ avgTrend }) => avgTrend, 'changeGt2')
        }),

        bestAvgTrendAnyPlayout: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(
                ({ avgTrend }) => avgTrend,
                playoutKey => [
                    'alwaysLast',
                    'onlyMax'
                ].every(compareKey => playoutKey !== compareKey)
            )
        }),

        bestAvgTrendPlayoutsOfInterest: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(
                ({ avgTrend }) => avgTrend,
                playoutKey => playoutsOfInterest.includes(playoutKey)
            )
        }),

        bestAvgTrendPlayoutsOfInterest: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(
                ({ percUp }) => percUp,
                playoutKey => playoutsOfInterest.includes(playoutKey)
            )
        }),


        // middleCounts

        middleCountsJohnsRecipe: createBreakdown({
            filterFn: middleCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }) =>
                hundredResult * (2 * percUp) * avgTrend * (2 * percHitsPositive)
            )
        }),

        middleCountsJohnsRecipeNoHundredResult: createBreakdown({
            filterFn: middleCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }) =>
                (2 * percUp) * avgTrend * (2 * percHitsPositive)
            )
        }),


        // shorts

        lowestLimitPlayoutsHundredResult: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                -1 * hundredResult
            )
        }),

        lowestLimitPlayoutsHundredResultCount: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                -1 * hundredResult * count
            )
        }),

        lowestLimitPlayoutsHundredResultPercUp: createBreakdown({
            filterFn: upperHalfCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                -1 * hundredResult * percUp * count
            )
        }),




        // low counts

        lowCountHundredResult: createBreakdown({
            filterFn: lowCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                hundredResult
            )
        }),

        lowCountHundredResultPercUp: createBreakdown({
            filterFn: lowCounts,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                hundredResult * percUp
            )
        }),

        anyCountPerfectos: createBreakdown({
            filterFn: obj => obj.percUp === 1,
            scoreFn: highestPlayoutFn(({ hundredResult, percUp, avgTrend, percHitsPositive }, count) =>
                count * avgTrend
            ),
            includeAll: true
        }),

    };

};


module.exports = {
    analyzeRoundup,
    highestPlayoutFn
};
