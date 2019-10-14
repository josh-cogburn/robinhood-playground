const lookup = require('../utils/lookup');
const cacheThis = require('../utils/cache-this');
const getTrend = require('../utils/get-trend');

const cachedLookup = cacheThis(lookup, 5);

const NUMS = [
  10,
  15,
  20,
  30,
  40
];

module.exports = async ticker => {
  const {
    currentPrice,
    prevClose
  } = await cachedLookup(ticker);
  const downTrend = getTrend(currentPrice, prevClose);

  
  strlog({ downTrend, ticker });

  const foundNum = NUMS.reverse().find(num => downTrend < 0 - num);

  return foundNum ? `down${foundNum}` : undefined;
};