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
    allPositions: allPositions,
    withoutKEG: allPositions.filter(({ ticker }) => ticker !== 'KEG'),
    lastFive: allPositions.filter(({ date }) => lastFive.includes(date)),
    yesterday: allPositions.filter(({ date }) => allDates[1] === date),
    today: allPositions.filter(({ date }) => allDates[0] === date),
    watchout: allPositions.filter(({ interestingWords }) => interestingWords.includes('watchout')),
    notWatchout: allPositions.filter(({ interestingWords }) => interestingWords.includes('!watchout')),
    bullish: allPositions.filter(({ interestingWords }) => interestingWords.includes('bullish')),
    neutral: allPositions.filter(({ interestingWords }) => interestingWords.includes('neutral')),
    bearish: allPositions.filter(({ interestingWords }) => interestingWords.includes('bearish')),
    majorJump: allPositions.filter(({ interestingWords }) => interestingWords.includes('majorJump')),
    mediumJump: allPositions.filter(({ interestingWords }) => interestingWords.includes('mediumJump')),
    minorJump: allPositions.filter(({ interestingWords }) => interestingWords.includes('minorJump')),
    singleMultiplier: allPositions.filter(({ numMultipliers }) => numMultipliers === 1),
    multipleMultipliers: allPositions.filter(({ numMultipliers }) => numMultipliers > 1),
    singlePick: allPositions.filter(({ numPicks }) => numPicks === 1),
    multiplePicks: allPositions.filter(({ numPicks }) => numPicks > 1),
  }, mapObject);
  
  await saveDateAnalysis(byDateAnalysis);
  await fs.writeFile('./json/overall-analysis.json', JSON.stringify(overall, null, 2));

  return {
    byDateAnalysis,
    overall
  };
};