const priceKeys = [1, 5, 10, 15, 20];
const perms = [
    // 'ticker-watchers',
    priceKeys.map(p => `under${p}`),
    ['shouldWatchout', 'notWatchout'],
    ['minorJump', 'majorJump', ''],
    ['initial', 'breakfast', 'lunch', 'dinner'],
    ['', 'failedHistorical'],
    ['', 'highVol'],
    [5000]
];

const flatten = arr => [].concat(...arr);
module.exports = () => {

    let collection = [
        'ticker-watchers'
    ];
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
