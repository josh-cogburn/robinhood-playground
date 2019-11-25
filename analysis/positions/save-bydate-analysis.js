const fs = require('mz/fs');
const cTable = require('console.table');
const { groupBy } = require('underscore');

const getAllPositions = require('./all');
const analyzeGroup = require('./analyze-group');
const DateAnalysis = require('../../models/DateAnalysis');

const saveDateAnalysis = async byDateAnalysis => {
  for (let { date, ...dateAnalysis } of byDateAnalysis) {
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
  
  const overall = {
    allPositions: analyzeGroup(allPositions),
    withoutKEG: analyzeGroup(allPositions.filter(({ ticker }) => ticker !== 'KEG')),
    lastFive: analyzeGroup(allPositions.filter(({ date }) => lastFive.includes(date))),
  };
  
  await saveDateAnalysis(byDateAnalysis);
  await fs.writeFile('./json/overall-analysis.json', JSON.stringify(overall, null, 2));

  return {
    byDateAnalysis,
    overall
  };
};