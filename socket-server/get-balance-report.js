const getAccountBalance = require('../utils/get-account-balance');
const alpacaBalance = require('../alpaca/get-balance');
const getIndexes = require('../utils/get-indexes');
const getTrend = require('../utils/get-trend');
const { alpaca } = require('../alpaca');

let lastBalance;

module.exports = async (isRegularHours = true) => {
  let { accountBalance } = await getAccountBalance();
//   if (Math.abs(getTrend(accountBalance, lastBalance)) > 4.9) {
//       console.log('WOAH WOAH', {
//           accountBalance,
//           lastBalance
//       });
//       accountBalance = lastBalance;
//   }
  lastBalance = accountBalance;
  const report = {
      accountBalance,
      indexPrices: await getIndexes(),
      alpacaBalance: await alpacaBalance(),
      isRegularHours
  };
  return report;
};