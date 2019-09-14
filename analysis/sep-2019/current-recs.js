const stratPerfOverall = require('../strategy-perf-overall');
const spmRecent = require('../spm-recent');
const getRecsFromFiveDayAndSPM = require('./get-recs-from-fiveday-and-spm');

module.exports = async () => {
  let fiveDay = (await stratPerfOverall(false, 5)).sortedByAvgTrend;
  fiveDay = fiveDay.filter(s => s.count >= 2 && s.count <= 8);
  const spmAll = (await spmRecent()).all
    .filter(s => s.count >= 3 && s.count <= 12);

  return getRecsFromFiveDayAndSPM(fiveDay, spmAll);
};