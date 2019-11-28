const { sumArray, avgArray, percUp } = require('../../utils/array-math');

const analyzeGroup = analyzedPositions => {
  const totalBought = sumArray(analyzedPositions.map(pos => pos.totalBuyAmt));
  const totalImpact = sumArray(analyzedPositions.map(pos => pos.netImpact));
  return {
    // dollars
    totalBought,
    totalImpact,
    // percentages
    percChange: +(totalImpact / totalBought * 100).toFixed(2),
    avgPositionImpactPerc: avgArray(analyzedPositions.map(pos => pos.impactPerc)),
    avgPickImpactPerc: avgArray(
      analyzedPositions.map(pos => 
        (new Array(pos.numPicks)).fill(pos.sellReturnPerc || pos.netImpact / pos.totalBuyAmt * 100)
      ).flatten()
    ),
    avgMultiplierImpactPerc: avgArray(
      analyzedPositions.map(pos => 
        (new Array(Math.round(pos.numMultipliers))).fill(pos.sellReturnPerc || pos.netImpact / pos.totalBuyAmt * 100)
      ).flatten()
    ),
    // percUp: percUp(
    //   analyzedPositions.map(pos => pos.netImpact)
    // ),
    // counts
    totalPositions: analyzedPositions.length,
    totalPicks: sumArray(analyzedPositions.map(pos => pos.numPicks)),
    totalMultipliers: sumArray(analyzedPositions.map(pos => pos.numMultipliers)),
  }
};

module.exports = analyzeGroup;