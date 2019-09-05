const runPennyScan = require('./run-penny-scan');

module.exports = ({ minPrice, maxPrice }) => 
  runPennyScan({
    minPrice,
    maxPrice,
    // minVolume: 32000,
    filterFn: ({
      tso, tsc
    }) => [tso, tsc].some(val => val < -7)
  });