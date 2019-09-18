const Pick = require('../models/Pick');

const INCLUDE = ['twoToFive'];
const DONT_INCLUDE = ['rsi-', 'golden-cross-', 'sudden-drops-', 'pennyscan-'];



module.exports = async () => {
  const todaysPicks = await Pick.find(
      { date: '9-18-2019' },
      { data: 0 }
  ).lean();


  const junk = todaysPicks.filter(({ strategyName }) => {
    return INCLUDE.every(str => strategyName.includes(str))
    && DONT_INCLUDE.every(str => !strategyName.includes(str));
  });

  
  strlog({
    todaysPicks: todaysPicks.length,
    junk: junk.length,
    junk2: junk.slice(0, 50)
  })

  strlog({
    response: await Pick.deleteMany({
      _id: { '$in': junk.map(pick => pick._id) }
    })
  })
};