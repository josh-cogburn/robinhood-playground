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
        (new Array(pos.numPicks)).fill(pos.sellReturnPerc || pos.netImpact / pos.totalBuyAmt * 100)
      ).flatten()
    ),
    avgMultiplierReturn: avgArray(
      analyzedPositions.map(pos => 
        (new Array(Math.round(pos.numMultipliers))).fill(pos.sellReturnPerc || pos.netImpact / pos.totalBuyAmt * 100)
      ).flatten()
    ),
    totalPicks: sumArray(analyzedPositions.map(pos => pos.numPicks)),
    totalMultipliers: sumArray(analyzedPositions.map(pos => pos.numMultipliers)),
  }
};

module.exports = analyzeGroup;