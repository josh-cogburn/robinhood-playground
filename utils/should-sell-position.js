const sellBrackets = {
  bullish: [-11, 17],    // stSent > 130
  neutral: [-8, 13],     // stSent > 70
  bearish: [-6, 9],     // stSent < 70
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

module.exports = shouldSell;