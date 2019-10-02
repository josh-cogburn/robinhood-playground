const { alpaca } = require('../alpaca');
const Pick = require('../models/Pick');
const { mapObject } = require('underscore');
const Holds = require('../models/Holds');

module.exports = async () => {
  const todayPicks = await Pick.find({
    date: '10-2-2019',
    isRecommended: true
  }, { data: 0 });
  strlog({
    todayPicks
  })
  const buys = (
    await alpaca.getOrders({
      status: 'all',
      // after: '2019-09-27T13:25:05.281Z',
      // until: Date,
      // limit: 400,
      direction: 'desc'
    })
  ).filter(order => order.side === 'buy');
  const byTicker = {};
  buys.forEach(order => {
    const { symbol } = order;
    byTicker[symbol] = [
      ...byTicker[symbol] || [],
      order
    ]
  });
  strlog({ byTicker });

  const matchedUp = mapObject(byTicker, orders => orders.map(order => ({
    order,
    foundPick: todayPicks.slice().reverse().find(pick => (new Date(pick.timestamp)).getTime() < (new Date(order.filled_at)).getTime())
  })));

  for (let ticker of Object.keys(matchedUp)) {
    const matches = matchedUp[ticker].filter(match => match.foundPick);
    for (let match of matches) {
      await Holds.findOneAndDelete({ ticker });
      await Holds.registerAlpacaFill({
        ticker,
        alpacaOrder: match.order,
        strategy: match.foundPick.strategyName,
        PickDoc: match.foundPick,
        date: '10-2-2019'
      })
    }
  }

  strlog({ matchedUp })
}