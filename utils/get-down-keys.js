const lookup = require('./lookup');
const cacheThis = require('./cache-this');
const getTrend = require('./get-trend');
const { avgArray, percUp } = require('./array-math');
const { mapObject } = require('underscore');
const getHistoricals = require('../realtime/historicals/get');

const cachedLookup = cacheThis(lookup, 10);

const NUMS = [
  10,
  15,
  20,
  30,
  40
];

module.exports = cacheThis(async ticker => {

  let historicals = await getHistoricals([ticker], 5, undefined, true);
  historicals = historicals[ticker];
  strlog({ historicals })
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

  let obj = mapObject({
    down: prevClose,
    avgh: avgHigh
  }, val => getTrend(currentPrice, val));

  const withAnalysis = historicals.map((hist, index, arr) => ({
    ...hist,
    isHeadingDown: index <= 9 ? null : hist.close_price <= avgArray(historicals.slice(0, index).slice(-9).map(h => h.close_price))
  })).filter(hist => hist.isHeadingDown !== null );
  strlog({ withAnalysis })
  strlog({ obj })
  obj = mapObject({
    down: val => NUMS.reverse().find(num => val <= 0 - num),
    avgh: val => NUMS.reverse().find(num => val <= 0 - num),
    straightDown: val => [Number.POSITIVE_INFINITY, 200, 80, 30].find(toConsider => {
      const ofInterest = withAnalysis.slice(0 - toConsider);
      const percDown = percUp(ofInterest.map(hist => hist.isHeadingDown));
      strlog({ toConsider, percDown })
      return percDown > 70;
    })
  }, (fn, key) => fn(obj[key]));
  

  console.log(obj);


  obj = Object.entries(obj)
    .filter(([key, val]) => val)
    .reduce((acc, [key, val]) => ({ ...acc, [`${key}${val}`]: true }), {})


  return obj;
}, 3);