const fs = require('mz/fs');
const cTable = require('console.table');
const { groupBy } = require('underscore');

const getOpen = require('./get-open');
const getClosed = require('./get-closed');
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

  let closed = await getClosed();
  let open = await getOpen();

  strlog({
    open,
    closed
  })

  console.log("OPEN");
  console.table(
    open.sort((a, b) => new Date(b.date) - new Date(a.date))
  );

  console.log("CLOSED")
  console.table(
    closed
      .sort((a, b) => Math.abs(b.sellReturnDollars) - Math.abs(a.sellReturnDollars))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );


  const combined = [
    ...open,
    ...closed
  ]
    .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
    .map(position => ({
      ...position,
      netImpact: position.netImpact || position.sellReturnDollars
    }))
    .map(position => ({
      ...position,
      impactPerc: +(position.netImpact / position.totalBuyAmt * 100).toFixed(2)
    }));;

  const byDate = groupBy(combined, 'date');
  const byDateAnalysis = Object.keys(byDate).map(date => {
    const datePositions = byDate[date];
    return {
      date,
      ...analyzeGroup(datePositions)
    };
  });

  const allDates = combined.map(pos => pos.date).uniq();
  const lastFive = allDates.slice(0, 5);
  strlog({ allDates, lastFive })
  
  const overall = {
    allPositions: analyzeGroup(combined),
    withoutKEG: analyzeGroup(combined.filter(({ ticker }) => ticker !== 'KEG')),
    lastFive: analyzeGroup(combined.filter(({ date }) => lastFive.includes(date))),
  };
  
  await saveDateAnalysis(byDateAnalysis);
  await fs.writeFile('./json/overall-analysis.json', JSON.stringify(overall, null, 2));

  return {
    byDateAnalysis,
    overall
  };
};