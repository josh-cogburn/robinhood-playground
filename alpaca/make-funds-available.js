const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const getPositions = require('./get-positions');
const { sumArray } = require('../utils/array-math');
const alpacaMarketSell = require('./market-sell');
const stratManager = require('../socket-server/strat-manager');

module.exports = async amt => {


  let positions = await getPositions(true);
  positions = positions.filter(({ ticker }) => !keep.includes(ticker));
  const notDTs = positions.filter(({ wouldBeDayTrade }) =>!wouldBeDayTrade);

  const totalAvailableToSell = sumArray(positions.map(p => Number(p.market_value)));


  const percToSell = Math.min(100, Math.round((amt * 1.3) / totalAvailableToSell * 100));
  console.log({ amt, totalAvailableToSell, percToSell })
  await stratManager.init({ lowKey: true });
  return Promise.all(
      notDTs.map(({ ticker, quantity }) => 
          alpacaMarketSell({
              ticker,
              quantity: Math.ceil(quantity * percToSell / 100),
              timeoutSeconds: 7,
          })
      )
  );

  // const totalValue = 


  // sellAllStocksPercent = Number(sellAllStocksPercent);

  
  



}