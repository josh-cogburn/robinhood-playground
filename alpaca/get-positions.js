const { alpaca } = require('.');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const { avgArray } = require('../utils/array-math');
const getTrend = require('../utils/get-trend');
const Holds = require('../models/Holds');
const Pick = require('../models/Pick');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');

const checkForHugeDrop = position => {
  let { current_price, returnPerc: actualReturnPerc, avgEntry: actualEntry, hold: { buys = [] } } = position;
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

  const uniqDates = [
    (new Date()).toLocaleDateString().split('/').join('-'),
    ...(await Pick.getUniqueDates()).reverse()
  ].uniq();

  console.log({
    uniqDates
  })
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
    const hold = await Holds.findOne({ ticker }) || {};
    if (!hold.buys) {
      console.log('hey! no buys?', ticker);
    }
    const { buys = [] } = hold;


    const buyStrategies = buys.map(buy => buy.strategy).reduce((acc, strategy) => ({
      ...acc,
      [strategy]: (acc[strategy] || 0) + 1
    }), {});


    const [daysOld, mostRecentPurchase] = buys.length >= 1 ? [
      buys[0],
      buys[buys.length - 1]
    ].map(buy => getDaysOld(buy.date)) : [0, 0];

    // strlog({ buys});

    const DONTSELL = [
      'KEG',
      'TCON'
    ];

    const wouldBeDayTrade = DONTSELL.includes(ticker)|| Boolean(mostRecentPurchase === 0);
    return {
      ...position,
      hold,
      buyStrategies,
      daysOld,
      mostRecentPurchase,
      wouldBeDayTrade,
      stSent: await getStSentiment(ticker) || {}
    };
  });

  positions = positions.map(position => ({
    ...position,
    ...checkForHugeDrop(position)
  }));

  positions = positions.map(position => {
    const { 
      stSent: { upperLimit, lowerLimit },
      returnPerc
    } = position;
    return {
      ...position,
      outsideBracket: Boolean(returnPerc >= upperLimit || returnPerc <= lowerLimit)
    };
  });

  const ratioDayPast = 0.2 || Math.max(0.2, Math.min(getMinutesFrom630() / 360, 1));
  strlog({ ratioDayPast })
  const getPercToSell = position => {
    let { 
      daysOld, 
      returnPerc, 
      outsideBracket, 
      wouldBeDayTrade, 
      ticker, 
      market_value, 
      unrealized_intraday_plpc,
      stSent: { stBracket }
    } = position;

    if (daysOld >= 3 && market_value < 30) {
      return 100;
    }

    // if (wouldBeDayTrade) return null;
    if (getMinutesFrom630() < 20 && returnPerc > 20) return 50;
    if (Math.abs(returnPerc) > 30) return 24;
    // basePerc = dayVal + returnVal
    const dayVal = (daysOld + 1) * 3;
    const returnVal = Math.abs(returnPerc) / 3;
    const basePercent = dayVal + returnVal;
    // shouldVal is based on intraday pl
    let shouldVal = Math.abs(Number(unrealized_intraday_plpc)) * 100 / 1.4;
    if (outsideBracket) {
      shouldVal += returnPerc ? 4 : 7;
    }
    // subtract perc if looking good?
    const stBracketNumbers = {
      bullish: 2,
      neutral: 1
    };
    const stOffset = stBracketNumbers[stBracket] || 0;

    const summed = basePercent + shouldVal - stOffset;

    const halfSum = summed * .5;
    const weightedByDayInProgress = halfSum + ratioDayPast * halfSum;
    const randomized = weightedByDayInProgress + (Math.random() * 3) - 1.5;

    strlog({
      ticker,
      wouldBeDayTrade,
      basePercent,
      shouldVal,
      summed,
      halfSum,
      weightedByDayInProgress,
      randomized,
    });

    return +randomized.toFixed(2);
  };

  const getRecommendation = position => {
    const { returnPerc, outsideBracket, wouldBeDayTrade } = position;
    if (!outsideBracket) {
      return '---';
    }
    const action = (returnPerc > 0) ? 'take profit' : 'cut your losses';
    return wouldBeDayTrade ? `possibly ${action}` : action;
  };

  const withRecommendations = positions
    .map(position => ({
      ...position,
      recommendation: getRecommendation(position),
      percToSell: getPercToSell(position)
    }));

  

  return withRecommendations;

};