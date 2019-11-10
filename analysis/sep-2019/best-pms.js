const allPmAnalysis = require('./all-pm-analysis');

module.exports = async () => {
  const pmAnalysis = await allPmAnalysis();
  return pmAnalysis
    .filter(perf => {
      const {
        overallAvg: lebAvg,
        percUp: lebPercUp,
        jsonAnalysis: { daysCount, avgTrend, percUp } = {}
      } = perf;
      return [
        // lebowski perfs,
        lebAvg > 0,
        lebPercUp > 60,
        // json perfs,
        daysCount > 1,
        avgTrend > 2,
        percUp > 90
      ].every(Boolean);
    });
};