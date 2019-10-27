const { forPurchase } = require('../settings');
const pmJson = require('../analysis/sep-2019/pm-json');

const getExpectedCountForPm = pm => {

};

module.exports = async () => {

  const pmPerf = await pmJson(4);

  const forPurchasePms = forPurchase
    .filter(
      line => line.startsWith('[') && line.endsWith(']')
    )
    .map(line => line.substring(1, line.length - 1));
    
  strlog({ forPurchasePms, pmPerf });

  const withExpected = forPurchasePms.map(pm => ({
    pm,
    expected: (pmPerf[pm] || {}).count
  }));

  return withExpected;

}