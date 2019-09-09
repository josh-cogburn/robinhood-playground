const runScan = require('./base/run-scan');

module.exports = ({ minPrice, maxPrice } = {}) => 
  runScan({
    minPrice,
    maxPrice,
    // minVolume: 32000,
    filterFn: ({
      tso, tsc
    }) => [tso, tsc].some(val => val < -7)
  });