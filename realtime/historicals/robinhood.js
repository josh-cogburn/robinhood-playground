const chunkApi = require('../../utils/chunk-api');
const getTrend = require('../../utils/get-trend');

module.exports = async (tickers, period) => {

    if (typeof tickers === 'string') tickers = [tickers];
    period = Number(period);

    // console.log(tickers)
    const allHistoricals = await chunkApi(
        tickers,
        async tickerStr => {
          return (
            await Robinhood.url(
              `https://api.robinhood.com/quotes/historicals/?symbols=${tickerStr}&interval=${period}minute&bounds=extended`
            )
          ).results;
        },
        75
    );

    console.log(`robinhood historicals for ${tickers.length} tickers...`);
    strlog({ allHistoricals })

    const processHistoricals = historicals => {
      return historicals
        .map((hist, index, arr) => {
          const prevClose = (arr[index - 1] || {}).close_price;
          ['open_price', 'close_price', 'high_price', 'low_price'].forEach(key => {
              hist[key] = Number(hist[key]);
          });
          if (prevClose) {
              hist.trend = getTrend(hist.close_price, prevClose);
          }
          return hist;
        })
        .map(hist => ({
          ...hist,
          currentPrice: hist.close_price,
          timestamp: new Date(hist.begins_at).getTime() + (1000 * 60 * period)
        }));
    };
      
    return allHistoricals
      .filter(obj => obj && obj.symbol && obj.historicals)
      .reduce((acc, { symbol, historicals }) => ({
        ...acc,
        [symbol]: processHistoricals(historicals)
      }), {});


};