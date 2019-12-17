const watchout = ({ interestingWords }) => interestingWords.includes('watchout');
const notWatchout = ({ interestingWords }) => !interestingWords.includes('watchout');
const bearish = ({ interestingWords }) => interestingWords.includes('bearish');
const notStraightDowner = ({ interestingWords }) => interestingWords.every(word => !word.startsWith('straightDown'));

const minorJump = ({ interestingWords }) => interestingWords.includes('minorJump');
const mediumJump = ({ interestingWords }) => interestingWords.includes('mediumJump');
const majorJump = ({ interestingWords }) => interestingWords.includes('majorJump');

const bullish = ({ interestingWords }) => interestingWords.includes('bullish');

const overnightDrops = ({ interestingWords }) => interestingWords.includes('overnight');
const lunch = ({ interestingWords }) => interestingWords.includes('lunch');
const afterhours = ({ interestingWords }) => interestingWords.includes('afterhours');
const oneToTwo = ({ interestingWords }) => interestingWords.includes('oneToTwo');

const straightDown60 = ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown60'));
const straightDown120 = ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown120'));
const bigDowner = p => straightDown60(p) || straightDown120(p);

const spread1 = ({ interestingWords }) => interestingWords.includes('spread1');

module.exports = positions => {

  const allWords = positions.map(pos => pos.interestingWords).flatten().uniq();
  // console.log({ allWords})


  const allDates = positions.map(pos => pos.date).uniq().filter(Boolean);
  const lastFive = allDates.slice(0, 5);
  return {
    allPositions: () => true,
    notAfterhours: p => !afterhours(p),
    notOJ: p => !overnightDrops(p),
    withoutKEG: ({ ticker }) => ticker !== 'KEG',
    withoutASLN: ({ ticker }) => ticker !== 'ASLN',
    lastFive: ({ date }) => lastFive.includes(date),
    yesterday: ({ date }) => allDates[1] === date,
    today: ({ date }) => allDates[0] === date,
    watchout,
    notWatchout,
    watchoutMajorJump: p => watchout(p) && majorJump(p),
    bullish,
    neutral: ({ interestingWords }) => interestingWords.includes('neutral'),
    bearish,
    bullishMajorJump: p => bullish(p) && majorJump(p),
    majorJump,
    mediumJump,
    minorJump,
    medOrMajJump: p => mediumJump(p) || majorJump(p),
    onlyMinorJump: p => minorJump(p) && !mediumJump(p) && !majorJump(p),
    onlyMinorJumpSpread1: p => minorJump(p) && !mediumJump(p) && !majorJump(p) && spread1(p),
    onlyMinorJumpBigDowner: p => minorJump(p) && !mediumJump(p) && !majorJump(p) && bigDowner(p),
    singleMultiplier: ({ numMultipliers }) => numMultipliers === 1,
    multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
    singlePick: ({ numPicks }) => numPicks === 1,
    multiplePicks: ({ numPicks }) => numPicks > 1,
    notWatchoutMajorJump: position => notWatchout(position) && majorJump(position),
    // notWatchoutMajorJumpNotStraightDowner: position => notWatchout(position) && majorJump(position) && notStraightDowner(position),
    straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),
    straightDown30: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown30')),
    straightDown60,
    straightDown120,
    bigDowner,
    notStraightDowner,
    straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),
    firstAlert: ({ interestingWords }) => interestingWords.includes('firstAlert'),
    notFirstAlert: ({ interestingWords }) => !interestingWords.includes('firstAlert'),
    avgh: ({ interestingWords }) => interestingWords.some(val => val.startsWith('avgh')),
    notAvgh: ({ interestingWords }) => !interestingWords.some(val => val.startsWith('avgh')),
    hotSt: ({ interestingWords }) => interestingWords.includes('hotSt'),
    notHotSt: ({ interestingWords }) => !interestingWords.includes('hotSt'),
    // collections
    zeroToOne: ({ interestingWords }) => interestingWords.includes('zeroToOne'),
    oneToTwo,
    fitty: ({ interestingWords }) => interestingWords.includes('fitty'),
    lowVolFitty: ({ interestingWords }) => interestingWords.includes('lowVolFitty'),
    fiveToTen: ({ interestingWords }) => interestingWords.includes('fiveToTen'),
  
    // minKey
    initial: ({ interestingWords }) => interestingWords.includes('initial'),
    brunch: ({ interestingWords }) => interestingWords.includes('brunch'),
    lunch,
    dinner: ({ interestingWords }) => interestingWords.includes('dinner'),
    afterhours,
  
    // combos
    oneToTwoAndLunch: p => lunch(p) && oneToTwo(p),
    overnightDrops,
    
    // spread
    spread1,
    spread2: ({ interestingWords }) => interestingWords.includes('spread2'),
    spread3: ({ interestingWords }) => interestingWords.includes('spread3'),
    spread4: ({ interestingWords }) => interestingWords.includes('spread4'),
    spread5: ({ interestingWords }) => interestingWords.includes('spread5'),
    spread6: ({ interestingWords }) => interestingWords.includes('spread6'),

    // downs
    down10: ({ interestingWords }) => interestingWords.includes('down10'),
    down15: ({ interestingWords }) => interestingWords.includes('down15'),
    down20: ({ interestingWords }) => interestingWords.includes('down20'),
    down30: ({ interestingWords }) => interestingWords.includes('down30'),
    down40: ({ interestingWords }) => interestingWords.includes('down40'),
    notDown: ({ interestingWords }) => interestingWords.includes('!down'),

  };
};
