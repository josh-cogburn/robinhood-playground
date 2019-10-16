const lookup = require('./lookup');
const cacheThis = require('./cache-this');
const getTrend = require('./get-trend');
const { avgArray } = require('./array-math');
const { mapObject } = require('underscore');
const getHistoricals = require('../realtime/historicals/get');

const cachedLookup = cacheThis(lookup, 5);

const NUMS = [
  10,
  15,
  20,
  30,
  40
];

module.exports = cacheThis(async ticker => {

  let historicals = await getHistoricals([ticker], 5);
  historicals = historicals[ticker];

  const highs = historicals
    .filter(hist => 
      (new Date()).toLocaleDateString() !== new Date(hist.timestamp).toLocaleDateString()
    )
    .map(hist => hist.high_price);
    
  strlog({ highs })
  const avgHigh = avgArray(
    highs
  );

  const {
    currentPrice,
    prevClose
  } = await cachedLookup(ticker);

  const obj = mapObject({
    down: prevClose,
    avgh: avgHigh
  }, val => {
    console.log({ val });
    const downTrend = getTrend(currentPrice, val);
    return NUMS.reverse().find(num => downTrend < 0 - num);
  });
  console.log(obj)
  return Object.entries(obj)
    .filter(([key, val]) => val)
    .reduce((acc, [key, val]) => ({ ...acc, [`${key}${val}`]: true }), {})
  
  
}, 3);