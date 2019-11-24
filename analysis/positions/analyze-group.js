const { sumArray, avgArray } = require('../../utils/array-math');

const analyzeGroup = analyzedPositions => {
  const totalBought = sumArray(analyzedPositions.map(pos => pos.totalBuyAmt));
  const totalImpact = sumArray(analyzedPositions.map(pos => pos.netImpact));
  return {
    totalBought,
    percChange: +(totalImpact / totalBought * 100).toFixed(2),
    avgDayImpact: avgArray(analyzedPositions.map(pos => pos.impactPerc)),
    totalImpact,
    avgPickReturn: avgArray(
      analyzedPositions.map(pos => 
        (new Array(pos.numPicks)).fill(pos.sellReturnPerc)
      ).flatten()
    )
  }
};

module.exports = analyzeGroup;