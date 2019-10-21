const sellBrackets = {
  bullish: [-10, 14],    // stSent > 130
  neutral: [-7, 9],     // stSent > 70
  bearish: [-4, 6],     // stSent < 70
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
  const shouldSell = Boolean(returnPerc >= upperLimit || returnPerc <= lowerLimit);
  strlog({
    ticker,
    sellBracket,
    returnPerc,
    shouldSell
  })
  return {
    shouldSell,
    sellBracket,
    upperLimit,
    lowerLimit
  };
};

module.exports = shouldSell;