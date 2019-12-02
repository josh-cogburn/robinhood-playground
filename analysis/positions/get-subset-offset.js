const getSubsets = require('./get-subsets');
const { mapObject } = require('underscore');
const { sumArray } = require('../../utils/array-math');
const sendEmail = require('../../utils/send-email');

const subsetOffsets = {
  // allPositions: () => true,
  // withoutKEG: ({ ticker }) => ticker !== 'KEG',
  // lastFive: ({ date }) => lastFive.includes(date),
  // yesterday: ({ date }) => allDates[1] === date,
  // today: ({ date }) => allDates[0] === date,
  watchout: -7,
  notWatchout: 3,

  bullish: -1,
  neutral: 0,
  bearish: 2,

  majorJump: 4,
  mediumJump: 2,
  minorJump: 0,

  singleMultiplier: -1,
  // multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
  singlePick: -1,
  // multiplePicks: ({ numPicks }) => numPicks > 1,
  notWatchoutMajorJump: 2,
  // notWatchoutMajorJumpNotStraightDowner: 1,

  straightDowner: 1,
  straightDown60: 4,
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
  fitty: -5,
  // fiveToTen: ({ interestingWords }) => interestingWords.includes('fiveToTen'),

  // minKey
  // initial: ({ interestingWords }) => interestingWords.includes('initial'),
  brunch: 0,
  lunch: 2,
  dinner: 0,
  afterhours: -500,

  // combos
  oneToTwoAndLunch: 1,
  overnightDrops: -500,

  spread1: 3,
  spread2: -1,
  spread3: -1,
  spread4: 1,
  spread5: 0,
  spread6: 0,

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
        : 0
  );
  const { ticker, interestingWords } = position;
  const data = {ticker, interestingWords, withOffsets};
  strlog(data)
  const totals = Object.values(withOffsets);
  await sendEmail(`subset offset report for ${ticker}`, JSON.stringify({ data }, null, 2));
  return sumArray(totals.filter(Boolean));
};