const theBigLebowski = require('./the-big-lebowski');
const pmJson = require('./pm-json');

module.exports = async () => {

  const lebowskiPms = (
    await theBigLebowski(14)
  ).pmsAnalyzed;

  const pmJsonAnalysis = await pmJson(10);

  strlog({ lebowskiPms, pmJsonAnalysis})

  return lebowskiPms.map(pmPerf => ({
    ...pmPerf,
    jsonAnalysis: pmJsonAnalysis[pmPerf.pm]
  }))


};