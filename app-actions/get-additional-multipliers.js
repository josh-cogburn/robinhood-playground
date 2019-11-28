const { mapObject } = require('underscore');
const { avgArray } = require('../utils/array-math');



module.exports = async pms => {

  const stratManager = require('../socket-server/strat-manager');
  await stratManager.init({ lowKey: true });
  const { pmsAnalyzed } = stratManager;
  strlog({ pmsAnalyzed })

  strlog({ pmAnalysis, avgChecks, trueFalseAvgChecks, avgCheckCount })


  // const sentimentObj = {
  //   bullish: 2,
  //   neutral: 1
  // };

  // const sentimentCount = 

  // const sentCount = Number(['bullish', 'neutral'].some(key => pms.some(pm => pm.includes(key))));

  return avgCheckCount + sentCount;
};