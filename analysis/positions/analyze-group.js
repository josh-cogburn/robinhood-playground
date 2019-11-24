const { sumArray, avgArray } = require('../../utils/array-math');

const analyzeGroup = analyzedPositions => {
  const totalBought = sumArray(analyzedPositions.map(pos => pos.totalBuyAmt));
  const totalImpact = sumArray(analyzedPositions.map(pos => pos.netImpact));
  return {
    totalBought,
    percChange: +(totalImpact / totalBought * 100).toFixed(2),
    avgImpactPerc: avgArray(analyzedPositions.map(pos => pos.impactPerc)),
    totalImpact
  }
};

module.exports = analyzeGroup;