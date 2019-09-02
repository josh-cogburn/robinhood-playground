const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const marketClosures = require('../market-closures');
const formatDate = date => date.toLocaleDateString().split('/').join('-');

const START_MIN = 0;
const STOP_MIN = 390;

module.exports = (startMin = START_MIN, stopMin = STOP_MIN) => {
  // if between start and end times then start() on init
  const min = getMinutesFrom630();
  console.log({ min })
  const isBetweenMinutes = Boolean(min > startMin && min < STOP_MIN);
  const isWeekday = [0, 6].every(day => (new Date()).getDay() !== day);

  const marketClosed = (() => {
    const dateStr = formatDate(new Date());
    return marketClosures.includes(dateStr);
  })();
  marketClosed && console.log("MARKET CLOSED TODAY SUCKA!");
  return !marketClosed && isBetweenMinutes && isWeekday;
};