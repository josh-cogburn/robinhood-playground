const runScan = require('../../scans/base/run-scan');
const getRecentVolume = require('./get-recent-volume');

module.exports = async () => {

  const scan = await runScan({
    minVolume: 50000,
    minPrice: 0.1,
    maxPrice: 13,
    count: 400,
    includeStSent: false,
    afterHoursReset: true
    // minDailyRSI: 45
  });

  const allTickers = scan.map(result => result.ticker).uniq();
  
  const recentVolumeLookups = await getRecentVolume(allTickers);

  strlog({ allTickers: allTickers.length });

  const withRecentVolume = scan
    .map(result => ({
      ...result,
      recentVolume: recentVolumeLookups[result.ticker],
    }))
    .sort((a, b) => b.recentVolume.ratio - a.recentVolume.ratio);


  // strlog({
  //   topRatio: withRecentVolume.map(({ ticker, recentVolume }) => ({
  //     ticker,
  //     recentVolume
  //   })).slice(0, 6)
  // });


  const recentVolumeCollections = {
      highestRecentVolume: 'avgRecentVolume',
      highestRecentVolumeRatio: 'ratio',
      highestRecentDollarVolume: 'recentDollarVolume'
  };

  return Object.keys(recentVolumeCollections)
    .reduce((acc, key) => {
        const prop = recentVolumeCollections[key];
        return {
            ...acc,
            [key]: withRecentVolume
                .filter(result => result.recentVolume[prop])
                .sort((a, b) => b.recentVolume[prop] - a.recentVolume[prop])
                .slice(0, 7),
            [`${key}Up`]: withRecentVolume
              .filter(result => result.recentVolume[prop])
              .filter(result => result.recentVolume.recentTrend > 0.2)
              .sort((a, b) => b.recentVolume[prop] - a.recentVolume[prop])
              .slice(0, 7),
            [`${key}UpUp`]: withRecentVolume
              .filter(result => result.recentVolume[prop])
              .filter(result => result.recentVolume.recentTrend > 0.2)
              .filter(result => result.computed.tso > 0.2 && result.computed.tsc > 0.2)
              .sort((a, b) => b.recentVolume[prop] - a.recentVolume[prop])
              .slice(0, 7)
        };
    }, {});



};