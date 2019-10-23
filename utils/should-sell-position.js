const stBrackets = {
  bullish: [-10, 14],    // stSent > 130
  neutral: [-7, 9],     // stSent > 70
  bearish: [-4, 6],     // stSent < 70
};

const shouldSell = position => {
  // strlog({ position });

  const { returnPerc, stSent, ticker } = position;
  const stBracket = (() => {
    if (stSent > 130) return 'bullish';
    if (stSent < 40) return 'bearish';
    return 'neutral';
  })();

  const [lowerLimit, upperLimit] = stBrackets[stBracket];
  const shouldSell = Boolean(returnPerc >= upperLimit || returnPerc <= lowerLimit);
  strlog({
    ticker,
    stBracket,
    returnPerc,
    shouldSell
  })
  return {
    shouldSell,
    stBracket,
    upperLimit,
    lowerLimit
  };
};

module.exports = shouldSell;