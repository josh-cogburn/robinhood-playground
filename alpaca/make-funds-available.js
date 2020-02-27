const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const getPositions = require('./get-positions');
const { sumArray } = require('../utils/array-math');
const { makeKeeperFundsAvailable } = require('../settings');
const alpacaMarketSell = require('./market-sell');
const stratManager = require('../socket-server/strat-manager');


const getBuyTickers = async () => {
  const orders = await alpaca.getOrders({
      status: 'open'
  });
  str({ orders })

  const matchingOrders = orders.filter(order => {
      return order.side === 'buy'
  });

  str({ matchingOrders})

  return matchingOrders.map(order => order.symbol).uniq();
};


module.exports = async amt => {

  let positions = await getPositions(true);
  if (!makeKeeperFundsAvailable) {
    positions = positions.filter(({ notSelling }) => !notSelling);
  }
  const notDTs = positions.filter(({ wouldBeDayTrade }) =>!wouldBeDayTrade);

  const buyTickers = await getBuyTickers();
  strlog({ buyTickers})
  const notActiveBuys = notDTs.filter(({ ticker }) => !buyTickers.includes(ticker));
  strlog({ notActiveBuys})

  const totalAvailableToSell = sumArray(notActiveBuys.map(p => Number(p.market_value)));


  const percToSell = Math.min(100, Math.round((amt * 1.3) / totalAvailableToSell * 100));
  console.log({ amt, totalAvailableToSell, percToSell })
  await stratManager.init({ lowKey: true });
  return Promise.all(
    notActiveBuys.map(({ ticker, quantity }) => console.log({ ticker, quantity})
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