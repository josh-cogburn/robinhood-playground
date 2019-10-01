
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const { alpaca } = require('.');
const marketBuy = require('./market-buy');

const limitBuy = async ({
  ticker,
  limitPrice,
  quantity,
  timeoutSeconds = 15,
  fallbackToMarket = true,
}) => {
  // queue alpaca limit order 4% above pickPrice
  log('ALPACA LIMIT BUY');
  str({ ticker, quantity, limitPrice });
  const min = getMinutesFrom630();
  const extendedHours = min < 0 || min > 390;
  const data = {
      symbol: ticker, // any valid ticker symbol
      qty: Number(quantity),
      side: 'buy',
      type: 'limit',
      limit_price: Number(limitPrice),
      ...extendedHours ? {
          extended_hours: true,
          time_in_force: 'day',
      } : {
          time_in_force: 'day'
      }
  };
  log('data buy alpaca', data)
  let order;
  try {
      order = await alpaca.createOrder(data);
  } catch (e) {
      strlog({ e })
  }

  await new Promise(resolve => setTimeout(resolve, 1000 * timeoutSeconds));
  order = order ? await alpaca.getOrder(attemptResponse.id) : {};

  if (order.filled_at) {
      return order;
  } else if (order.id) {
      await alpaca.cancelOrder(order.id);
  }

  if (fallbackToMarket) {
    return marketBuy({
      ticker,
      quantity
    });
  }


};

module.exports = limitBuy;
