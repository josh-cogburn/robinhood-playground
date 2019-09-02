const runPennyScan = require('./run-penny-scan');

module.exports = () => 
  runPennyScan({
    minVolume: 40000,
    filterFn: ({
      tso, tsc, tsh
    }) => [tso, tsc, tsh].every(val => Math.abs(val) < 5)
  });