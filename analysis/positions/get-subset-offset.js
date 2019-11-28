const getSubsets = require('./get-subsets');
const { mapObject } = require('underscore');
const { sumArray } = require('../../utils/array-math');

const subsetOffsets = {
  // allPositions: () => true,
  // withoutKEG: ({ ticker }) => ticker !== 'KEG',
  // lastFive: ({ date }) => lastFive.includes(date),
  // yesterday: ({ date }) => allDates[1] === date,
  // today: ({ date }) => allDates[0] === date,
  watchout: -7,
  notWatchout: 1,

  bullish: -1,
  neutral: 0,
  bearish: 2,

  majorJump: 2,
  mediumJump: 1,
  minorJump: 0,

  singleMultiplier: -1,
  // multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
  singlePick: -0.5,
  // multiplePicks: ({ numPicks }) => numPicks > 1,
  notWatchoutMajorJump: 2,
  // notWatchoutMajorJumpNotStraightDowner: 1,

  straightDowner: 1,
  straightDown60: 3,
  // notStraightDowner: 1,
  // straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),
  // firstAlert: ({ interestingWords }) => interestingWords.includes('firstAlert'),
  notFirstAlert: -4,
  // avgh: ({ interestingWords }) => interestingWords.some(val => val.startsWith('avgh')),
  notAvgh: -5,
  hotSt: -1,
  // notHotSt: ({ interestingWords }) => !interestingWords.includes('hotSt'),
  // collections
  // zeroToOne: ({ interestingWords }) => interestingWords.includes('zeroToOne'),
  oneToTwo: 2,
  fitty: -3,
  // fiveToTen: ({ interestingWords }) => interestingWords.includes('fiveToTen'),

  // minKey
  // initial: ({ interestingWords }) => interestingWords.includes('initial'),
  brunch: 0,
  lunch: 2,
  dinner: 0,
  afterhours: -500,

  // combos
  oneToTwoAndLunch: 1,
  overnightDrops: -500
};


module.exports = interestingWords => {
  interestingWords = 'sudden drops !watchout brunch bullish mediumJump !down hotSt 5min avgh10 spread3 firstAlert'.split(' ');
  const fakePosition = { interestingWords };
  const subsets = getSubsets([fakePosition]);
  const withOffsets = mapObject(
    subsets, 
    (filterFn, key) => 
      filterFn(fakePosition) 
        ? subsetOffsets[key] 
        : 0
  );
  strlog({interestingWords, withOffsets})
  const totals = Object.values(withOffsets);
  return sumArray(totals.filter(Boolean));
};