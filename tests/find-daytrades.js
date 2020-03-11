const { alpaca } = require('../alpaca');

module.exports = async () => {
  const orders = await alpaca.getOrders({
    status: 'all',
    after: '2020-03-11T01:25:05.281Z',
    // until: Date,
    limit: 300,
    direction: 'desc'
  });
  const symbols = orders.map(order => order.symbol).uniq();

  const daytrade = symbols.filter(symbol => {
    const relatedOrders = orders.filter(order => order.symbol === symbol);
    const buy = relatedOrders.find(order => order.side === 'buy');
    const sell = relatedOrders.find(order => order.side === 'sell');
    return buy && sell;
  });


  strlog({ orders, symbols, daytrade })
};