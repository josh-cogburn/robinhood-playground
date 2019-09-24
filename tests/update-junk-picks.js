const Pick = require('../models/Pick');

const INCLUDE = [''];
const DONT_INCLUDE = [];



module.exports = async () => {
  const todaysPicks = await Pick.find(
      { date: '9-24-2019' },
      { data: 0 }
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

  for (let { _id, strategyName } of junk) {
    // const newSn = strategyName.split('twoToFive-').join('');
    // strlog({ _id, old: strategyName, newSn });
    await Pick.update({
      _id
    }, {
      isRecommended: false,
      // strategyName: newSn
    })
  }

  // strlog({
  //   response: await Pick.deleteMany({
  //     _id: { '$in': junk.map(pick => pick._id) }
  //   })
  // })
};