const runScan = require('./base/run-scan');

module.exports = ({ minPrice, maxPrice, ...rest } = {}) => 
  runScan({
    minPrice,
    maxPrice,
    // minVolume: 32000,
    filterFn: ({
      tso, tsc
    }) => [tso, tsc].every(val => val < -7),
    ...rest
  });