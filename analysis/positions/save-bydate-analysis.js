const fs = require('mz/fs');
const cTable = require('console.table');
const { groupBy, mapObject } = require('underscore');

const getAllPositions = require('./all');
const analyzeGroup = require('./analyze-group');
const DateAnalysis = require('../../models/DateAnalysis');

const saveDateAnalysis = async byDateAnalysis => {
  for (let { date, ...dateAnalysis } of byDateAnalysis) {
    console.log({
      date,
      dateAnalysis
    })
    await DateAnalysis.findOneAndUpdate(
      { date }, 
      dateAnalysis, 
      { upsert: true }
    );
    console.log(`updated analysis for ${date}`);
  }
};



module.exports = async () => {

  const allPositions = await getAllPositions();

  const byDate = groupBy(allPositions, 'date');
  const byDateAnalysis = Object.keys(byDate).map(date => {
    const datePositions = byDate[date];
    return {
      date,
      ...analyzeGroup(datePositions)
    };
  });

  const allDates = allPositions.map(pos => pos.date).uniq();
  const lastFive = allDates.slice(0, 5);
  strlog({ allDates, lastFive })
  
  const notWatchout = ({ interestingWords }) => interestingWords.includes('!watchout');
  const majorJump = ({ interestingWords }) => interestingWords.includes('majorJump');
  const bearish = ({ interestingWords }) => interestingWords.includes('bearish');
  const notStraightDowner = ({ interestingWords }) => interestingWords.includes('!straightDown');

  const overall = mapObject({
    allPositions: undefined,
    withoutKEG: ({ ticker }) => ticker !== 'KEG',
    lastFive: ({ date }) => lastFive.includes(date),
    yesterday: ({ date }) => allDates[1] === date,
    today: ({ date }) => allDates[0] === date,
    watchout: ({ interestingWords }) => interestingWords.includes('watchout'),
    notWatchout,
    bullish: ({ interestingWords }) => interestingWords.includes('bullish'),
    neutral: ({ interestingWords }) => interestingWords.includes('neutral'),
    bearish,
    majorJump,
    mediumJump: ({ interestingWords }) => interestingWords.includes('mediumJump'),
    minorJump: ({ interestingWords }) => interestingWords.includes('minorJump'),
    singleMultiplier: ({ numMultipliers }) => numMultipliers === 1,
    multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
    singlePick: ({ numPicks }) => numPicks === 1,
    multiplePicks: ({ numPicks }) => numPicks > 1,
    notWatchoutMajorJump: position => notWatchout(position) && majorJump(position),
    notWatchoutMajorJumpNotStraightDowner: position => notWatchout(position) && majorJump(position) && notStraightDowner(position),
    straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),
    notStraightDowner,
    straightDowner: ({ interestingWords }) => interestingWords.some(val => val.startsWith('straightDown')),
    firstAlert: ({ interestingWords }) => !interestingWords.includes('firstAlert'),
    avgh: ({ interestingWords }) => interestingWords.some(val => val.startsWith('avgh')),
    notAvgh: ({ interestingWords }) => !interestingWords.some(val => val.startsWith('avgh')),

  }, (filterFn = () => true) => 
    analyzeGroup(
      allPositions.filter(filterFn)
    )
  );
  
  await saveDateAnalysis(byDateAnalysis);
  await fs.writeFile('./json/overall-analysis.json', JSON.stringify(overall, null, 2));

  return {
    byDateAnalysis,
    overall
  };
};