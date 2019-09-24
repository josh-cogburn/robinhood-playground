const BalanceReport = require('../models/BalanceReport');

module.exports = async () => {
  strlog({
    response: await BalanceReport.updateMany({}, { 
      alpacaBalance: 1200
    })
  })
};