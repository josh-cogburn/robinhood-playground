const lookup = require('../utils/lookup');
const cacheThis = require('../utils/cache-this');
const getTrend = require('../utils/get-trend');
const { avgArray } = require('../utils/array-math');
const getHistoricals = require('../realtime/historicals/get');

const cachedLookup = cacheThis(lookup, 5);

const NUMS = [
  10,
  15,
  20,
  30,
  40
];

module.exports = async ticker => {

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
  } = await cachedLookup(ticker);
  const downTrend = getTrend(currentPrice, avgHigh);

  
  strlog({ avgHigh, currentPrice })
  strlog({ downTrend, ticker });

  const foundNum = NUMS.reverse().find(num => downTrend < 0 - num);

  return foundNum ? `down${foundNum}` : undefined;
};