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

// const perms = [
//     ['stock-invest'],
//     ['top100', 'undervalued'],
//     [4, 104, 200]
// ];

const perms = [
    ['only-up'],
    ['', 'sp500'],
    ["", "onjn1to1", "onjn1to1AndTSOn1to1", "onj1to4AndTSOn5ton1", "onjn6ton1AndTSO1to3", "yesterdayDown", 'yesterdayDown10to3'],
    [
        365,
        100,
        90,
        60,
        30,
        20,
        15,
        10,
        7,
        5,
    ],
    [
        'percUp',
        'lightTrendScore',
        'heavyTrendScore',
        'inverseLightTrendScore',
        'inverseHeavyTrendScore',
        'periodTrendVolatilityScore'
    ],
    [
        '',
        'volatilityPick',
        'periodTrendVolatilityPick'
    ]
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
