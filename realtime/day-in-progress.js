const getMinutesFrom630 = require('../utils/get-minutes-from-630');

const START_MIN = -51;
const STOP_MIN = 631;
const TIMEOUT_SECONDS = 15;

module.exports = () => {
  // if between start and end times then start() on init
  const min = getMinutesFrom630();
  const isBetweenMinutes = Boolean(min > START_MIN && min < STOP_MIN);
  const isWeekday = [0, 6].every(day => (new Date()).getDay() !== day);
  return isBetweenMinutes && isWeekday;
};