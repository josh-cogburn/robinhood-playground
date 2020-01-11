const getMultipleHistoricals = require('../../app-actions/get-multiple-historicals');
const { avgArray } = require('../../breakdown-key-compares');

module.exports = async (tickers = []) => {


  let allHistoricals = await getMultipleHistoricals(
      tickers,
      `interval=10minute&bounds=extended`
  );

  let withHistoricals = tickers.map((ticker, i) => ({
      ticker,
      historicals: allHistoricals[i]
  }));

  const withRatio = withHistoricals.map(obj => {
    const { ticker, historicals } = obj;
    const [
      avgRecentVolume,
      avgOverallVolume
    ] = [
      historicals.slice(-2),
      historicals
    ].map(hists => avgArray(hists.map(hist => hist.volume)));

    return {
      // ...obj,
      ticker,
      avgRecentVolume,
      avgOverallVolume,
      ratio: avgRecentVolume / avgOverallVolume
    };
  });


  const asObject = withRatio.reduce((acc, { ticker, ...rest }) => ({
    ...acc,
    [ticker]: rest
  }), {});

  
  return asObject;
};