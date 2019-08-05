const allStocks = require('../../json/stock-data/allStocks');
const lookupMultiple = require('../../utils/lookup-multiple');
const { isTradeable } = require('../../utils/filter-by-tradeable');
const getStSent = require('../../utils/get-stocktwits-sentiment');
const getMultipleHistoricals = require('../../app-actions/get-multiple-historicals');

// strategies

const addHistoricals = async (tickers, interval, span) => {

  const keyName = `${span}Historicals`;
  
  // add historical data
  let allHistoricals = await getMultipleHistoricals(
      tickers,
      `interval=${interval}&span=${span}`
  );

  let withHistoricals = tickers
    .map((ticker, i) => ({
        ticker,
        [keyName]: allHistoricals[i]
    }))
    .filter(buy => buy[keyName].length);

  const first = withHistoricals;
  const single = first[keyName];
  console.log('count: ', single.length);
  console.log('last: ', (new Date(single[single.length - 1].begins_at).toLocaleString()));
  

  return withHistoricals;
};

const getTickersBetween = async (min, max) => {
  const tickPrices = await lookupMultiple(allStocks.filter(isTradeable).map(o => o.symbol));
  const tickers = Object.keys(tickPrices)
    .filter(ticker => tickPrices[ticker] < max && tickPrices[ticker] > min)
    .reduce((acc, ticker) => ({
      ...acc,
      [ticker]: tickPrices[ticker]
    }), {});
  // console.log({ kstTickers: tickers });
  return tickers;
};

module.exports = async (includeCurrentPrice = true) => {
  console.log({ includeCurrentPrice })
  const tickerObj = await getTickersBetween(10, 20);
  const withHistoricals = (await addHistoricals(Object.keys(tickerObj), 'day', 'year'))
    .filter(buy => buy.yearHistoricals && buy.yearHistoricals.length);

  const formattedPrices = withHistoricals.map(({ ticker, yearHistoricals }) => {
    // strlog({
    //   ticker,
    //   yearHistoricals: yearHistoricals.length
    // })
    const allPrices = yearHistoricals.map(hist => ({
      ...hist,
      currentPrice: hist.close_price
    }));
    if (includeCurrentPrice) {
      allPrices.push({
        currentPrice: tickerObj[ticker]
      });
    }
    return {
      ticker,
      allPrices,
    };
  });

  return formattedPrices;

  // const withGoldenCross = formattedPrices.map(buy => ({
  //   ...buy,
  //   goldenCross: goldenCross(buy)
  // }));

  // // strlog({ withGoldenCross });

  // const goldenCrosses = withGoldenCross
  //   .filter(buy => buy.goldenCross)
  //   .map(buy => buy.ticker);
  
  // strlog({
  //   goldenCrosses
  // });


  // const withStSent = await mapLimit(goldenCrosses, 2, async ticker => ({
  //   ticker,
  //   stSent: (await getStSent(ticker)).bullBearScore
  // }));

  // console.table(withStSent);
};