const { alpaca } = require('.');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const shouldSellPosition = require('../utils/should-sell-position');
const Holds = require('../models/Holds');
const Pick = require('../models/Pick')
module.exports = async () => {

  const uniqDates = (await Pick.getUniqueDates()).reverse();
  const getDaysOld = date => uniqDates.indexOf(date);
  strlog({ uniqDates })

  let positions = (await alpaca.getPositions())
    .map(({ symbol, avg_entry_price, qty, unrealized_plpc }) => ({
      ticker: symbol,
      average_buy_price: avg_entry_price,
      quantity: qty,
      returnPerc: unrealized_plpc * 100
    }));

  positions = await mapLimit(positions, 3, async position => {
    const { ticker } = position;
    const hold = await Holds.findOne({ ticker });
    const buyStrategies = !hold ? [] : hold.buys.map(buy => buy.strategy).reduce((acc, strategy) => ({
      ...acc,
      [strategy]: (acc[strategy] || 0) + 1
    }), {});
    const lastBuyDate = hold.buys.map(buy => buy.date).pop();
    const daysOld = getDaysOld(lastBuyDate);

    // strlog({ buys});

    const wouldBeDayTrade = Boolean(daysOld === 0);
    return {
      ...position,
      hold,
      buyStrategies,
      wouldBeDayTrade,
      daysOld,
      stSent: (await getStSentiment(ticker) || {}).bullBearScore
    };
  });

  positions = positions.map(position => ({
    ...position,
    ...shouldSellPosition(position)
  }));

  strlog({ positions })

  return positions;

};