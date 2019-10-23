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
    const { buys = [] } = hold;
    const buyStrategies = buys.map(buy => buy.strategy).reduce((acc, strategy) => ({
      ...acc,
      [strategy]: (acc[strategy] || 0) + 1
    }), {});


    const [daysOld, mostRecentPurchase] = [
      buys[0],
      buys[arr.length - 1]
    ].map(getDaysOld);

    // strlog({ buys});

    const wouldBeDayTrade = Boolean(mostRecentPurchase === 0);
    return {
      ...position,
      hold,
      buyStrategies,
      daysOld,
      mostRecentPurchase,
      wouldBeDayTrade,
      stSent: (await getStSentiment(ticker) || {}).bullBearScore
    };
  });

  const getRecommendation = position => {
    const { daysOld, returnPerc, shouldSell } = position;

    if (!shouldSell) {
      return '---';
    }

    if (returnPerc) {
      return 'take profit';
    }

    return (daysOld <= 5)
      ? 'average down'
      : 'cut your losses' // :-(

  };

  const withRecommendations = positions
    .map(position => ({
      ...position,
      ...shouldSellPosition(position)
    }))
    .map(position => ({
      ...position,
      recommendation: getRecommendation(position)
    }));

  

  return withRecommendations;

};