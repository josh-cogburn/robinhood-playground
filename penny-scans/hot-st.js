const runPennyScan = require('./run-penny-scan');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');

module.exports = ({ minPrice, maxPrice } = {}) => {
  const min = getMinutesFrom630();
  const irregularHours = min < 0 || min > 390;
  const limitUp = !irregularHours ? 5 : 2;
  return runPennyScan({
    // minVolume: 80000,
    minPrice,
    maxPrice,
    filterFn: ({
      tso, tsc
    }) => [tsc, tso].every(val => val > limitUp)
  });
};
  
