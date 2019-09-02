const runPennyScan = require('./run-penny-scan');

module.exports = () => 
  runPennyScan({
    minVolume: 80000,
    filterFn: ({
      tso, tsc
    }) => [tsc, tso].every(val => val > 5)
  });

