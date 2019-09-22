const fs = require('mz/fs');
const { mapObject } = require('underscore');
const { avgArray } = require('../../utils/array-math');

module.exports = async (daysBack = 5) => {
  daysBack = Number(daysBack);
  let files = await fs.readdir('./json/pm-perfs');

  let sortedFiles = files
      .map(f => f.split('.')[0])
      .sort((a, b) => new Date(a) - new Date(b));

  
  const filesOfInterest = sortedFiles.slice(0 - daysBack);

  const byPm = {};
  for (let file of filesOfInterest) {
    const json = require(`../../json/pm-perfs/${file}`);
    json.forEach(({ pmName, avgTrend, percUp }) => {
      byPm[pmName] = [
        ...byPm[pmName] || [],
        {
          avgTrend,
          percUp: percUp / 100
        }
      ]
    });
  }


  const analyzed = mapObject(
    byPm,
    trends => ['avgTrend', 'percUp'].reduce((acc, key) => {

      const val = avgArray(
        trends.map(t => t[key])
      );

      return {
        ...acc,
        [key]: val
      };

    }, {})
  )

  strlog({ analyzed });

  return analyzed;

}