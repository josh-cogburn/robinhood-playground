const runPennyScan = require('./run-penny-scan');

module.exports = ({ minPrice, maxPrice } = {}) => 
  runPennyScan({
    minVolume: 40000,
    minPrice,
    maxPrice,
    filterFn: ({
      tso, tsc, tsh
    }) => [tso, tsc, tsh].every(val => Math.abs(val) < 5)
  });