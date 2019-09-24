const allAvgDowners = {};
const AvgDowner = require('./avg-downer');

module.exports = data => {

  const { 
    ticker, 
    // buyPrice, 
    // initialTimeout = INITIAL_TIMEOUT, 
    // strategy,
  } = data;

  if (allAvgDowners[ticker]) {
    allAvgDowners[ticker].stop();
    allAvgDowners[ticker] = null;
  }

  allAvgDowners[ticker] = new AvgDowner(data);

};