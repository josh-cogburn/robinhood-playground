const { mapObject } = require('underscore');
const { avgArray } = require('../utils/array-math');
const getSubsetOffset = require('../analysis/positions/get-subset-offset');

const calcPmAnalysisMultiplier = (pms, pmsAnalyzed) => {

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
    min: values => Math.min(...values.filter(Boolean)) > 1,
  };

  const trueFalseAvgChecks = mapObject(avgChecks, (checkFn, prop) => {
    return checkFn(pmAnalysis.map(pmPerf => pmPerf[prop]));
  });

  const avgCheckCount = Object.values(trueFalseAvgChecks).filter(Boolean).length;
  strlog({ pmAnalysis, avgChecks, trueFalseAvgChecks, avgCheckCount })

  return avgCheckCount;
};

module.exports = async (pms, strategy, stocksToBuy) => {
  console.log({
    pms,
    strategy,
    stocksToBuy
  })
  console.log('get additional multipliers')
  const stratManager = require('../socket-server/strat-manager');
  await stratManager.init({ lowKey: true });
  const { pmsAnalyzed, positions: { alpaca } } = stratManager;
  
  const pmAnalysisMultiplier = calcPmAnalysisMultiplier(pms, pmsAnalyzed);

  const existingInterestingWords = stocksToBuy.map(ticker => 
    alpaca.find(pos => pos.ticker === ticker)
  ).filter(Boolean).map(position => position.interestingWords).flatten();
  const interestingWords = [
    ...existingInterestingWords,
    ...[
      ...pms,
      strategy
    ].map(str => str.split('-')).flatten()
  ].uniq();
  console.log({ existingInterestingWords, interestingWords });
  const subsetOffsetMultiplier = getSubsetOffset(interestingWords);

  return {
    pmAnalysisMultiplier,
    subsetOffsetMultiplier
  };
};