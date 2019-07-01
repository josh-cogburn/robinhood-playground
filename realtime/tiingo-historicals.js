const getTrend = require('../utils/get-trend');
const cacheThis = require('../utils/cache-this');
const request = require('request-promise');
const { mapObject } = require('underscore');
const { tiingo: { token }} = require('../config');

const number = n => Number(n);

const getHistoricals = async (ticker, period) => {
  console.log({
    ticker,
    period
  })
  const sevenDaysDate = (new Date());
  sevenDaysDate.setDate(sevenDaysDate.getDate() - 7);
  const [month, day, year] = sevenDaysDate.toLocaleDateString().split('-');
  const formatted = [year, month, day].join('-');

  const requestOptions = {
    url: `https://api.tiingo.com/iex/${ticker}/prices?startDate=${formatted}&resampleFreq=${period}min&token=${token}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const response = await request(requestOptions);
  const parsed = JSON.parse(response);
  parsed.reverse();
  const hists = parsed
    .map(({ date, ...hist }) => {
      return {
        date: new Date(date),
        ...mapObject(hist, number)
      };
    });

  const withTrend = hists.map((hist, index) => {
    const prevDay = hists[index + 1];
    const withTSO = {
      ...hist,
      tso: getTrend(hist.open, hist.close)
    };
    if (!prevDay) return withTSO;
    return {
      ...withTSO,
      tsc: getTrend(prevDay.close, hist.close)
    };
  });

  const allVols = withTrend.map(hist => hist.volume).filter(Boolean);
  const maxVol = Math.max(...allVols);
  const minVol = Math.min(...allVols);
  // console.log({ maxVol, minVol });
  const spread = maxVol - minVol;
  const withVolumePerc = withTrend.map(hist => {
    const { volume } = hist;
    const volMinusMin = volume - minVol;
    return {
      ...hist,
      volumeRatio: volMinusMin / spread * 100,
      currentPrice: hist.close
    };
  });

  const withTimestamp = withVolumePerc.map(hist => ({
    ...hist,
    timestamp: new Date(hist.date).getTime() + (1000 * 60 * period)
  }));

  console.log(`got historicals for ${ticker}`);
  return withTimestamp.reverse();

};

module.exports = async (tickers, period) => {
  // console.log({ tickers })
  const historicals = {};
  for (let ticker of tickers) {
    try {
      historicals[ticker] = await getHistoricals(ticker, period);
    } catch (e) {
      console.error(e);
    }
    
  };
  return historicals;
}