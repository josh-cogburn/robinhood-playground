const AvgDowner = require('../utils/avg-downer');

module.exports = async () => {
  return new Promise(resolve => {
    new AvgDowner('AAPL', 225.72);
  });
};