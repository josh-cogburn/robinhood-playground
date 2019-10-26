const { alpaca } = require('.');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const shouldSellPosition = require('../utils/should-sell-position');
const { avgArray } = require('../utils/array-math');
const getTrend = require('../utils/get-trend');
const Holds = require('../models/Holds');
const Pick = require('../models/Pick');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');

const checkForHugeDrop = position => {
  let { current_price, returnPerc: actualReturnPerc, avgEntry: actualEntry, hold: { buys } } = position;
  const dropIndex = buys.slice().reverse().findIndex((buy, index, arr) => {
    const isBigDrop = arr[index + 1] && buy.fillPrice < arr[index + 1].fillPrice * .7;
    const isNotToday = buy.date !== (new Date()).toLocaleDateString().split('/').join('-');
		return isBigDrop && isNotToday;
  });
  if (dropIndex !== -1) {
    const avgEntry = avgArray(
      buys.slice(dropIndex).map(buy => buy.fillPrice)
    );
    return {
      dropIndex,
      avgEntry,
      returnPerc: getTrend(current_price, avgEntry),
      actualEntry,
      actualReturnPerc
    };
  }
};


module.exports = async () => {

  const uniqDates = (await Pick.getUniqueDates()).reverse();
  const getDaysOld = date => {
    return uniqDates.indexOf(date);
  };
  strlog({ uniqDates })
  
  let positions = (await alpaca.getPositions());
  strlog({ positions })
  positions = positions.map(({ symbol, avg_entry_price, qty, unrealized_plpc, ...rest }) => ({
    ticker: symbol,
    avgEntry: avg_entry_price,
    quantity: qty,
    returnPerc: unrealized_plpc * 100,
    ...rest
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
      buys[buys.length - 1]
    ].map(buy => getDaysOld(buy.date));

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

  positions = positions.map(position => ({
    ...position,
    ...checkForHugeDrop(position)
  }));

  const ratioDayPast = getMinutesFrom630() / 360;
  const getPercToSell = position => {
    let { daysOld, returnPerc, shouldSell, wouldBeDayTrade, ticker, market_value } = position;
    daysOld = daysOld + 1;

    if (daysOld > 3 && market_value < 20) {
      return 100;
    }

    // if (wouldBeDayTrade) return null;
    if (Math.abs(returnPerc) > 30) return 24;

    const basePercent = daysOld;
    let shouldVal = 0;
    if (shouldSell) {
      shouldVal += returnPerc ? 8 : 5;
    }

    const summed = basePercent + shouldVal;
    const halfSum = summed * .5;
    const weightedByDayInProgress = halfSum + ratioDayPast * halfSum;

    // strlog({
    //   ticker,
    //   wouldBeDayTrade,
    //   basePercent,
    //   shouldVal,
    //   summed,
    //   halfSum,
    //   weightedByDayInProgress
    // });

    return +weightedByDayInProgress.toFixed(2);
  };

  const getRecommendation = position => {
    const { returnPerc, shouldSell, wouldBeDayTrade } = position;
    if (!shouldSell) {
      return '---';
    }
    const action = (returnPerc > 0) ? 'take profit' : 'cut your losses';
    return wouldBeDayTrade ? `possibly ${action}` : action;
  };

  const withRecommendations = positions
    .map(position => ({
      ...position,
      ...shouldSellPosition(position)
    }))
    .map(position => ({
      ...position,
      recommendation: getRecommendation(position),
      percToSell: getPercToSell(position)
    }));

  

  return withRecommendations;

};