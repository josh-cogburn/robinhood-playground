const allTickerWatchers = [
    "ticker-watchers-under1-shouldWatchout-minorJump-initial-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-lunch-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-dinner-5000",
    "ticker-watchers-under1-shouldWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-initial-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-lunch-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-dinner-5000",
    "ticker-watchers-under1-shouldWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-initial-5000",
    "ticker-watchers-under1-shouldWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-breakfast-5000",
    "ticker-watchers-under1-shouldWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-lunch-5000",
    "ticker-watchers-under1-shouldWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under1-shouldWatchout-dinner-5000",
    "ticker-watchers-under1-shouldWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-minorJump-initial-5000",
    "ticker-watchers-under1-notWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under1-notWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-minorJump-lunch-5000",
    "ticker-watchers-under1-notWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-minorJump-dinner-5000",
    "ticker-watchers-under1-notWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-majorJump-initial-5000",
    "ticker-watchers-under1-notWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under1-notWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-majorJump-lunch-5000",
    "ticker-watchers-under1-notWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-majorJump-dinner-5000",
    "ticker-watchers-under1-notWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-initial-5000",
    "ticker-watchers-under1-notWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-breakfast-5000",
    "ticker-watchers-under1-notWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-lunch-5000",
    "ticker-watchers-under1-notWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under1-notWatchout-dinner-5000",
    "ticker-watchers-under1-notWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-initial-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-lunch-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-dinner-5000",
    "ticker-watchers-under5-shouldWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-initial-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-lunch-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-dinner-5000",
    "ticker-watchers-under5-shouldWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-initial-5000",
    "ticker-watchers-under5-shouldWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-breakfast-5000",
    "ticker-watchers-under5-shouldWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-lunch-5000",
    "ticker-watchers-under5-shouldWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under5-shouldWatchout-dinner-5000",
    "ticker-watchers-under5-shouldWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-minorJump-initial-5000",
    "ticker-watchers-under5-notWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under5-notWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-minorJump-lunch-5000",
    "ticker-watchers-under5-notWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-minorJump-dinner-5000",
    "ticker-watchers-under5-notWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-majorJump-initial-5000",
    "ticker-watchers-under5-notWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under5-notWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-majorJump-lunch-5000",
    "ticker-watchers-under5-notWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-majorJump-dinner-5000",
    "ticker-watchers-under5-notWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-initial-5000",
    "ticker-watchers-under5-notWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-breakfast-5000",
    "ticker-watchers-under5-notWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-lunch-5000",
    "ticker-watchers-under5-notWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under5-notWatchout-dinner-5000",
    "ticker-watchers-under5-notWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-initial-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-lunch-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-dinner-5000",
    "ticker-watchers-under10-shouldWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-initial-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-lunch-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-dinner-5000",
    "ticker-watchers-under10-shouldWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-initial-5000",
    "ticker-watchers-under10-shouldWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-breakfast-5000",
    "ticker-watchers-under10-shouldWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-lunch-5000",
    "ticker-watchers-under10-shouldWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under10-shouldWatchout-dinner-5000",
    "ticker-watchers-under10-shouldWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-minorJump-initial-5000",
    "ticker-watchers-under10-notWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under10-notWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-minorJump-lunch-5000",
    "ticker-watchers-under10-notWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-minorJump-dinner-5000",
    "ticker-watchers-under10-notWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-majorJump-initial-5000",
    "ticker-watchers-under10-notWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under10-notWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-majorJump-lunch-5000",
    "ticker-watchers-under10-notWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-majorJump-dinner-5000",
    "ticker-watchers-under10-notWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-initial-5000",
    "ticker-watchers-under10-notWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-breakfast-5000",
    "ticker-watchers-under10-notWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-lunch-5000",
    "ticker-watchers-under10-notWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under10-notWatchout-dinner-5000",
    "ticker-watchers-under10-notWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-initial-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-lunch-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-dinner-5000",
    "ticker-watchers-under15-shouldWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-initial-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-lunch-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-dinner-5000",
    "ticker-watchers-under15-shouldWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-initial-5000",
    "ticker-watchers-under15-shouldWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-breakfast-5000",
    "ticker-watchers-under15-shouldWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-lunch-5000",
    "ticker-watchers-under15-shouldWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under15-shouldWatchout-dinner-5000",
    "ticker-watchers-under15-shouldWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-minorJump-initial-5000",
    "ticker-watchers-under15-notWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under15-notWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-minorJump-lunch-5000",
    "ticker-watchers-under15-notWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-minorJump-dinner-5000",
    "ticker-watchers-under15-notWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-majorJump-initial-5000",
    "ticker-watchers-under15-notWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under15-notWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-majorJump-lunch-5000",
    "ticker-watchers-under15-notWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-majorJump-dinner-5000",
    "ticker-watchers-under15-notWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-initial-5000",
    "ticker-watchers-under15-notWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-breakfast-5000",
    "ticker-watchers-under15-notWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-lunch-5000",
    "ticker-watchers-under15-notWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under15-notWatchout-dinner-5000",
    "ticker-watchers-under15-notWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-initial-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-lunch-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-dinner-5000",
    "ticker-watchers-under20-shouldWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-initial-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-lunch-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-dinner-5000",
    "ticker-watchers-under20-shouldWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-initial-5000",
    "ticker-watchers-under20-shouldWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-breakfast-5000",
    "ticker-watchers-under20-shouldWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-lunch-5000",
    "ticker-watchers-under20-shouldWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under20-shouldWatchout-dinner-5000",
    "ticker-watchers-under20-shouldWatchout-dinner-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-minorJump-initial-5000",
    "ticker-watchers-under20-notWatchout-minorJump-initial-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-minorJump-breakfast-5000",
    "ticker-watchers-under20-notWatchout-minorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-minorJump-lunch-5000",
    "ticker-watchers-under20-notWatchout-minorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-minorJump-dinner-5000",
    "ticker-watchers-under20-notWatchout-minorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-majorJump-initial-5000",
    "ticker-watchers-under20-notWatchout-majorJump-initial-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-majorJump-breakfast-5000",
    "ticker-watchers-under20-notWatchout-majorJump-breakfast-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-majorJump-lunch-5000",
    "ticker-watchers-under20-notWatchout-majorJump-lunch-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-majorJump-dinner-5000",
    "ticker-watchers-under20-notWatchout-majorJump-dinner-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-initial-5000",
    "ticker-watchers-under20-notWatchout-initial-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-breakfast-5000",
    "ticker-watchers-under20-notWatchout-breakfast-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-lunch-5000",
    "ticker-watchers-under20-notWatchout-lunch-failedHistorical-5000",
    "ticker-watchers-under20-notWatchout-dinner-5000",
    "ticker-watchers-under20-notWatchout-dinner-failedHistorical-5000"
]

const onlyQuality = s => !s.includes('failedHistorical') && !s.includes('minorJump');
const TWgoodWatchouts = allTickerWatchers.filter(s => s.includes('shouldWatchout')).filter(onlyQuality);
const TWgoodNotWatchouts = allTickerWatchers.filter(s => s.includes('notWatchout')).filter(onlyQuality);


const TWallWatchout = allTickerWatchers.filter(s => s.includes('shouldWatchout'));
const TWallNotWatchout = allTickerWatchers.filter(s => s.includes('notWatchout'));
const TWminorJumps = allTickerWatchers.filter(s => s.includes('minorJump') && !s.includes('failedHistorical'));
const TWmajorJumps = allTickerWatchers.filter(s => s.includes('majorJump') && !s.includes('failedHistorical'));
const TWfailedHistorical = allTickerWatchers.filter(s => s.includes('failedHistorical'));


const TWgoodInitial = allTickerWatchers.filter(s => s.includes('initial'));
const TWgoodBreakfast = allTickerWatchers.filter(s => s.includes('breakfast'));
const TWgoodLunch = allTickerWatchers.filter(s => s.includes('lunch'));
const TWgoodDinner = allTickerWatchers.filter(s => s.includes('dinner'));



// final filters
const onlyMyDollars = s => s.includes('under1-') || s.includes('under5');
const noEarlyWatchouts = s => !(s.includes('shouldWatchout') && s.includes('initial'));
const onlyLaters = s => s.includes('lunch') || s.includes('dinner');

const myTickerWatchersInitial = [
    ...TWmajorJumps,
    ...TWgoodNotWatchouts,
    ...TWgoodNotWatchouts
].filter(onlyMyDollars);

const myLaters = [
    ...new Set(
        myTickerWatchersInitial
            .filter(onlyLaters)
            .filter(onlyMyDollars)
    )
];

const tenAndFifteenLaters = allTickerWatchers   /// WOW
    .filter(s => s.includes('under10') || s.includes('under15'))
    .filter(s => s.includes('notWatchout'))
    .filter(onlyQuality)
    .filter(onlyLaters);

const spicySenoritas = [
    'ticker-watchers-under15-notWatchout-initial-5000',
    'ticker-watchers-under15-notWatchout-breakfast-5000',
];

const mySuperBoosters = [
    'ticker-watchers-under5-notWatchout-breakfast-5000',
    'ticker-watchers-under1-notWatchout-breakfast-5000'
];

const myTickerWatchers = myTickerWatchersInitial         // with spice!
    .concat(myLaters)   // because we want the extra power!
    .filter(noEarlyWatchouts)
    .concat([   // last minute add-ons
        ...spicySenoritas,
        ...tenAndFifteenLaters
    ])
    .concat([
        // my super boosters for the day!
        ...mySuperBoosters
    ]);

module.exports = {
    allTickerWatchers,

    // should watchout not watchout
    TWgoodWatchouts,
    TWgoodNotWatchouts,
    TWallWatchout,
    TWallNotWatchout,

    // based on jump
    TWminorJumps,
    TWmajorJumps,

    // etc
    TWfailedHistorical,

    // time
    TWgoodInitial,
    TWgoodBreakfast,
    TWgoodLunch,
    TWgoodDinner,

    // going for the gold
        myTickerWatchersInitial,
        myLaters,
        tenAndFifteenLaters,
    
        // flare
        spicySenoritas,
        mySuperBoosters,

        myTickerWatchers,    
};
