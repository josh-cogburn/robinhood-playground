const Pick = require('../models/Pick');
const { difference, partition } = require('underscore');
const detailedNonZero = require('../app-actions/detailed-non-zero');
const cachedPositions = require('../utils/cached-positions');


let lastRecs = [];


const sellBrackets = {
  bullish: [-9, 14],    // stSent > 130
  neutral: [-6, 8],     // stSent > 70
  bearish: [-4, 5],     // stSent < 70
};

const shouldSell = position => {
  // strlog({ position });

  const { returnPerc, stSent, ticker } = position;
  const sellBracket = (() => {
    if (stSent > 130) return 'bullish';
    if (stSent < 40) return 'bearish';
    return 'neutral';
  })();

  const [lowerLimit, upperLimit] = sellBrackets[sellBracket];
  const shouldSellBool = Boolean(returnPerc >= upperLimit || returnPerc <= lowerLimit);
  strlog({
    ticker,
    sellBracket,
    returnPerc,
    shouldSellBool
  })
  return shouldSellBool;
};

module.exports = async (_, pennyPicks) => {


  // what to buy
  const uniqDates = await Pick.getUniqueDates();
  const mostRecent = uniqDates.pop();
  const pennyFinds = (
    await Pick.find({ date: mostRecent, strategyName: /penny/ }).lean()
  );

  const [lastHour, lastThreeDays] = partition(pennyFinds, pick => {
    return new Date(pick.timestamp).getTime() > Date.now() - 1000 * 60 * 60;
  });

  const getPicksTickers = picks => picks.map(pick => pick.picks[0].ticker).uniq();

  const newTickers = difference(...[
    lastHour,
    lastThreeDays
  ].map(getPicksTickers));

  strlog({
    newTickers,
    compares: [
      lastHour,
      lastThreeDays
    ].map(getPicksTickers)
  });

  // const uniqTickers = pennyFinds.map(pick => pick.picks[0].ticker).uniq();
  // strlog({ uniqTickers });
  // const newTickers = difference(uniqTickers, lastRecs);
  // lastRecs = uniqTickers;


  // what to sell

  const nonZero = await cachedPositions();
  const withShouldSell = nonZero.map(pos => ({
    ...pos,
    shouldSell: shouldSell(pos)
  }));

  const shouldSells = withShouldSell.filter(pos => pos.shouldSell);

  strlog({
    shouldSells
  });
  
  return {
    buy: newTickers,
    sell: shouldSells.map(pos => pos.ticker).uniq()
  };
};


