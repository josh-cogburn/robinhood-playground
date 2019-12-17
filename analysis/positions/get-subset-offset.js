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
  watchout: -6,
  notWatchout: 3,
  watchoutMajorJump: 6,

  bullish: -1,
  neutral: 0,
  bearish: 2,

  bullishMajorJump: 4,

  majorJump: 7,
  mediumJump: 2,
  minorJump: -4,
  onlyMinorJump: -9,

  singleMultiplier: -0.5,
  // multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
  singlePick: -0.5,
  // multiplePicks: ({ numPicks }) => numPicks > 1,
  // notWatchoutMajorJump: 2,
  // notWatchoutMajorJumpNotStraightDowner: 1,

  straightDowner: 1,
  straightDown60: 4,
  straightDown120: -3,
  notStraightDowner: 7,
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
  initial: -3,
  brunch: -3,
  lunch: 4,
  dinner: 3,
  afterhours: Number.NEGATIVE_INFINITY,

  // combos
  oneToTwoAndLunch: 5,
  overnightDrops: -1,

  spread1: 3,
  spread2: -3,
  spread3: -2,
  spread4: 2,
  spread5: 0,
  spread6: 0,

  down10: 1,
  down20: 1,
  down40: 1,



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
  await sendEmail(`subset offset report for ${ticker}`, JSON.stringify({ data }, null, 2));
  return sumArray(totals.filter(Boolean));
};