const Pick = require('../models/Pick');

const INCLUDE = ['sudden-drops'];
const DONT_INCLUDE = [];

const { isOvernight } = require('../realtime/strategies/sudden-drops');

module.exports = async () => {
  const todaysPicks = await Pick.find(
      { date: '10-1-2019' },
  ).lean();


  const junk = todaysPicks.filter(({ strategyName, isRecommended }) => {
    return INCLUDE.every(str => strategyName.includes(str))
    && DONT_INCLUDE.every(str => !strategyName.includes(str))
    && isRecommended
  });

  
  strlog({
    todaysPicks: todaysPicks.length,
    junk: junk.length,
    junk2: junk.slice(0, 50)
  })  

  for (let { _id, strategyName, data } of junk) {
    if (isOvernight(data.allPrices)) {
      const newSn = 'overnight-drops' + strategyName.split('sudden-drops')[1];
      strlog({ _id, old: strategyName, newSn });
      await Pick.update({
        _id
      }, {
        // isRecommended: false,
        strategyName: newSn
      })
    }
    
  }

  // strlog({
  //   response: await Pick.deleteMany({
  //     _id: { '$in': junk.map(pick => pick._id) }
  //   })
  // })
};