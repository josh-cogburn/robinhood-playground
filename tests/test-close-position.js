const Holds = require('../models/Holds');

module.exports = async () => {
  // await (await Holds.findOne({ ticker: 'ROYT' })).closePosition()

  const theHold = await Holds.findOneAndUpdate(
    { ticker:  'ROYT' },
    {
      $push: {
        sells: {
          date: (new Date()).toLocaleDateString().split('/').join('-'),
          fillPrice: 100,
          quantity: 15
        }
      }
    },
    { new: true }
  );

  return theHold.toObject();
}