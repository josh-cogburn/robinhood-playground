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

  suddenDrops: 3,
  
  // watchout: -5,
  // notWatchout: 3,
  // watchoutMajorJump: 2,

  // bullish: 1,
  // neutral: 0,
  // bearish: 0,

  // bullishMajorJump: 4,

  majorJump: 2,
  mediumJump: 2,
  minorJump: 2,
  // onlyMinorJump: -5,

  // singleMultiplier: -0.5,
  // multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
  // singlePick: -0.5,
  // multiplePicks: ({ numPicks }) => numPicks > 1,
  // notWatchoutMajorJump: 2,
  // notWatchoutMajorJumpNotStraightDowner: 1,

  straightDowner: -2,
  // straightDown30: 2,
  // straightDown120: 4,
  // notStraightDowner: 3,
  // straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),

  straightDownerWatchout: 5,
  notStraightDownerNotWatchout: 20,

  
  firstAlert: 1,
  // notFirstAlert: 0,
  avgh: 1,
  notAvgh: -1,
  // hotSt: -1,
  // notHotSt: 1,
  // collections
  zeroToOne: 2,
  oneToTwo: 2,
  fitty: -4,
  // fiveToTen: ({ interestingWords }) => interestingWords.includes('fiveToTen'),

  // minKey
  initial: 2,
  brunch: 2,
  lunch: 1,
  dinner: 1,
  afterhours: Number.NEGATIVE_INFINITY,

  // combos
  oneToTwoAndLunch: 5,
  overnightDrops: -1,

  spread1: 4,
  spread2: -1,
  spread3: 1,
  spread4: 1,
  spread5: 1,
  spread6: 0,

  down10: 1,
  down20: 2,
  down40: 4,

  tenMinMinors: -10,

  halt: -9,
  rocket: 2,
  delist: -3,

  avgDowner: 2,
  avgDowner3: 3,
  avgDowner6: 3,
  avgDownerUnder120Min: 5
  
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
}