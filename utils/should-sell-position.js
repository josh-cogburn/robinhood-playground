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

module.exports = shouldSell;