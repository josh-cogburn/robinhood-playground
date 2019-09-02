const runPennyScan = require('./run-penny-scan');

module.exports = () => 
  runPennyScan({
    minVolume: 32000,
    filterFn: ({
      tso, tsc
    }) => [tso, tsc].some(val => val < -7)
  });