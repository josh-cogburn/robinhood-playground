const stBrackets = {
  bullish: [-5, 13],    // stSent > 130
  neutral: [-7, 9],     // stSent > 70
  bearish: [-9, 7],     // stSent < 70
};

const positionWithBracket = position => {
  // strlog({ position });

  const { returnPerc, stSent, ticker } = position;
  const stBracket = (() => {
    if (stSent > 130) return 'bullish';
    if (stSent < 40) return 'bearish';
    return 'neutral';
  })();

  const [lowerLimit, upperLimit] = stBrackets[stBracket];
  const outsideBracket = Boolean(returnPerc >= upperLimit || returnPerc <= lowerLimit);
  strlog({
    ticker,
    stBracket,
    returnPerc,
    outsideBracket
  })
  return {
    outsideBracket,
    stBracket,
    upperLimit,
    lowerLimit
  };
};

module.exports = positionWithBracket;