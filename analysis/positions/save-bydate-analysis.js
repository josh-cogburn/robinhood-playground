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
  
  const overall = mapObject({
    allPositions: undefined,
    withoutKEG: ({ ticker }) => ticker !== 'KEG',
    lastFive: ({ date }) => lastFive.includes(date),
    yesterday: ({ date }) => allDates[1] === date,
    today: ({ date }) => allDates[0] === date,
    watchout: ({ interestingWords }) => interestingWords.includes('watchout'),
    notWatchout: ({ interestingWords }) => interestingWords.includes('!watchout'),
    bullish: ({ interestingWords }) => interestingWords.includes('bullish'),
    neutral: ({ interestingWords }) => interestingWords.includes('neutral'),
    bearish: ({ interestingWords }) => interestingWords.includes('bearish'),
    majorJump: ({ interestingWords }) => interestingWords.includes('majorJump'),
    mediumJump: ({ interestingWords }) => interestingWords.includes('mediumJump'),
    minorJump: ({ interestingWords }) => interestingWords.includes('minorJump'),
    singleMultiplier: ({ numMultipliers }) => numMultipliers === 1,
    multipleMultipliers: ({ numMultipliers }) => numMultipliers > 1,
    singlePick: ({ numPicks }) => numPicks === 1,
    multiplePicks: ({ numPicks }) => numPicks > 1,
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