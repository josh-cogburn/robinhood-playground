const priceKeys = [1, 5, 10, 15, 20];
// const perms = [
//     // 'ticker-watchers',
//     priceKeys.map(p => `under${p}`),
//     ['shouldWatchout', 'notWatchout'],
//     ['minorJump', 'majorJump', ''],
//     ['premarket', 'initial', 'breakfast', 'lunch', 'dinner', 'afterhours'],
//     ['', 'failedHistorical'],
//     ['', 'highVol', 'lowVol'],
//     [5000]
// ];

// const perms = [
//     ['under5', 'top100RH', 'sp500'],
//     ['tscLt2pt5', 'tscPosLt2pt5', ''],
//     ['highest', 'lowest'],
//     ['bullishCount', 'bearishCount', 'bullBearScore'],
//     ['', 'first2'],
//     [-25, 80, 130, 190, 270]
// ];

// const perms = [
//     ['ema-crossover-last-trade'],
//     ['trendingUp180SMA', 'allOthers'],
//     [100, 200, 330, 360, 380]
// ];

const perms = [
    ['stock-invest'],
    ['top100', 'undervalued'],
    [4, 104, 200]
];

const flatten = arr => [].concat(...arr);
module.exports = () => {

    let collection = [null];
    perms.forEach(perm => {
        // perm.forEach(str => {
            collection = flatten(
                collection.map(curVar => {
                    str({ curVar, perm })
                    return perm.map(
                        str => [
                            curVar,
                            str
                        ].filter(Boolean).join('-')
                    );
                })
            );
            log(
                collection
            )
        // });
    });

    


    log(
        perms
    )

    return collection
}
