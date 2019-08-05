const { SMA } = require('technicalindicators');

const calcSMA = (values, period) => 
  SMA.calculate({ values, period });

module.exports = {
  period: ['d', 30, 10],
  handler: ({ allPrices }) => {
    const closes = allPrices.map(hist => hist.currentPrice);
    const [secondToLast50, last50] = calcSMA(closes, 50).slice(-2);
    const [secondToLast200, last200] = calcSMA(closes, 200).slice(-2);
    // strlog({
    //   secondToLast50,
    //   last50,
    //   secondToLast200,
    //   last200
    // })
    const wasBelow = secondToLast50 < secondToLast200;
    const nowAbove = last50 > last200;
    
    return {
      keys: {
        goldenCross: wasBelow && nowAbove
      }
    };
  }
};

