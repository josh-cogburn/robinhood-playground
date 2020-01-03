const getSubsets = require('./get-subsets');
const { mapObject } = require('underscore');
const { sumArray } = require('../../utils/array-math');
const sendEmail = require('../../utils/send-email');
const { avoidSubsets = [] } = require('../../settings');

const subsetOffsets = {
  // allPositions: () => true,
  // withoutKEG: ({ ticker }) => ticker !== 'KEG',
  // lastFive: ({ date }) => lastFive.includes(date),
  // yesterday: ({ date }) => allDates[1] === date,
  // today: ({ date }) => allDates[0] === date,

  suddenDrops: 5,
  
  watchout: -2,
  notWatchout: 1,
  watchoutMajorJump: 2,

  bullish: -1,
  neutral: 0,
  bearish: 2,

  bullishMajorJump: 4,

  majorJump: 10,
  mediumJump: 5,
  minorJump: -4,
  onlyMinorJump: -5,

  singleMultiplier: -0.5,
  // multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
  singlePick: -0.5,
  // multiplePicks: ({ numPicks }) => numPicks > 1,
  // notWatchoutMajorJump: 2,
  // notWatchoutMajorJumpNotStraightDowner: 1,

  straightDowner: 0,
  // straightDown60: 4,
  straightDown120: -3,
  notStraightDowner: 5,
  // straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),
  // firstAlert: ({ interestingWords }) => interestingWords.includes('firstAlert'),
  notFirstAlert: 0,
  // avgh: ({ interestingWords }) => interestingWords.some(val => val.startsWith('avgh')),
  notAvgh: -1,
  hotSt: -1,
  // notHotSt: 1,
  // collections
  zeroToOne: -2,
  oneToTwo: 2,
  fitty: -4,
  // fiveToTen: ({ interestingWords }) => interestingWords.includes('fiveToTen'),

  // minKey
  initial: -1,
  brunch: 1,
  lunch: 4,
  dinner: 3,
  afterhours: Number.NEGATIVE_INFINITY,

  // combos
  oneToTwoAndLunch: 5,
  overnightDrops: -1,

  spread1: 3,
  spread2: -2,
  spread3: -1,
  spread4: 2,
  spread5: 0,
  spread6: 3,

  down10: 1,
  down20: 2,
  down40: 2,

  tenMinMinors: -10,

  halt: -5,
  rocket: 2,
  delist: -3,
  
};


module.exports = async position => {
  // interestingWords = 'sudden drops !watchout brunch bullish mediumJump !down hotSt 5min avgh10 spread3 firstAlert'.split(' ');
  // const position = { interestingWords };

  const subsets = getSubsets([position]);
  const withOffsets = mapObject(
    subsets, 
    (filterFn, key) => 
      filterFn(position) 
        ? subsetOffsets[key] 
        : undefined
  );
  const { ticker, interestingWords } = position;
  const data = {ticker, interestingWords, withOffsets};
  strlog(data)

  const totals = Object.values(withOffsets);
  // await sendEmail(`subset offset report for ${ticker}`, JSON.stringify({ data }, null, 2));
  return sumArray(totals.filter(Boolean));
};