const { mapObject } = require('underscore');
const { avgArray } = require('../utils/array-math');

module.exports = async pms => {

  const stratManager = require('../socket-server/strat-manager');
  await stratManager.init({ lowKey: true });
  const { pmsAnalyzed } = stratManager;
  strlog({ pmsAnalyzed })

  const pmAnalysis = pms
      .map(pm => 
          pmsAnalyzed.find(({ pm: comparePm }) => comparePm === pm)
      )
      .filter(Boolean)
      .filter(({ jsonAnalysis: { daysCount } = {} }) => daysCount >= 3);

  if (pmAnalysis.length < 2) return 0;

  const avgChecks = {
    overallAvg: values => avgArray(values) > 2,
    percUp: values => avgArray(values) > 87,
    min: values => Math.min(...values.filter(Boolean)) > 1
  };

  const trueFalseAvgChecks = mapObject(avgChecks, (checkFn, prop) => {
    return checkFn(pmAnalysis.map(pmPerf => pmPerf[prop]));
  });

  const trueCount = Object.values(trueFalseAvgChecks).filter(Boolean).length;
  strlog({ pmAnalysis, avgChecks, trueFalseAvgChecks, trueCount })

  return trueCount
};