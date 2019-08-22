const breakdowns = picks => {
  const singleTopVolumeSS = picks
    .sort((a, b) => b.projectedVolume - a.projectedVolume)
    .slice(0, 10)
    .sort((a, b) => b.stSent - a.stSent)
    .slice(0, 1);
  const singlePercMaxVolSS = picks
    .sort((a, b) => b.percMaxVol - a.percMaxVol)
    .slice(0, 8)
    .sort((a, b) => b.stSent - a.stSent)
    .slice(0, 1);
  const ss180 = picks
    .sort((a, b) => b.stSent - a.stSent)
    .filter(pick => pick.stSent >= 180);
  const topSS = picks
    .sort((a, b) => b.stSent - a.stSent)
    .slice(0, 1);
  const ssFirstTwo = picks
    .sort((a, b) => b.stSent - a.stSent)
    .slice(0, 2);
  const stTrendRatioFirst3 = picks
    .sort((a, b) => b.stTrendRatio - a.stTrendRatio)
    .slice(0, 3);
  return {
    singleTopVolumeSS,
    singlePercMaxVolSS,
    ss180,
    topSS,
    ssFirstTwo,
    stTrendRatioFirst3
  };
};

const scans = [
  'nowheres',
  'hot-st',
  'droppers'
];

module.exports = async () => {

  const picks = [];
  for (let scan of scans) {
    const scanFn = require(`../penny-scans/${scan}`);
    console.log('running ', scan, 'PENNY SCAN');
    const response = await scanFn();
    const brokenDown = breakdowns(response);
    Object.keys(brokenDown).forEach(subset => {

      brokenDown[subset].forEach(pick => {
        const { ticker, ...rest } = pick;
        picks.push({
          ticker,
          strategyName: 'pennyscan',
          keys: {
            [scan]: true,
            [subset]: true
          },
          data: rest
        });
      });

    });

  }
  return picks;

};