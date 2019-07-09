const { mapObject } = require('underscore');

const marketClosures = require('../../market-closures');
const formattedClosures = marketClosures.map(str => (new Date(str)).toLocaleDateString());

const rhHistoricals = require('./robinhood');
const tiingoHistoricals = require('./tiingo');

module.exports = async (tickers, period) => {

  const historicalMethods = {
    5: tiingoHistoricals,
    10: tiingoHistoricals,
    30: tiingoHistoricals
  };
  
  const removeClosures = historicalObj =>
    mapObject(
      historicalObj,
      hists => hists.filter(hist => {
        const histDate = (new Date(hist.timestamp)).toLocaleDateString();
        return formattedClosures.every(closure => histDate !== closure);
      })
    );

  return removeClosures(
    await historicalMethods[period](tickers, period)
  );

};