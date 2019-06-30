const chunkApi = require('../utils/chunk-api');
const getTrend = require('../utils/get-trend');

module.exports = async (Robinhood, tickers, interval = 'day') => {
    console.log(tickers)
    const allHistoricals = await chunkApi(
        tickers,
        async (tickerStr) => {
            const { results } = await Robinhood.url(`https://api.robinhood.com/quotes/historicals/?symbols=${tickerStr}&interval=${interval}`);
            return results;
        },
        75
    );

    // console.log({ tickers, allHistoricals });


    return  allHistoricals
      .filter(obj => obj && obj.symbol)
      .reduce((acc, obj) => ({
        ...acc,
        [obj.symbol]: obj.historicals.map((hist, index, arr) => {
          const prevClose = (arr[index - 1] || {}).close_price;
          ['open_price', 'close_price', 'high_price', 'low_price'].forEach(key => {
              hist[key] = Number(hist[key]);
          });
          if (prevClose) {
              hist.trend = getTrend(hist.close_price, prevClose);
          }
          hist.currentPrice = hist.close_price;
          return hist;
        })
      }), {});


};
