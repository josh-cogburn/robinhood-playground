const limitSell = require('./limit-sell');
const Holds = require('../models/Holds');
const sendEmail = require('../utils/send-email');

module.exports = async ({ ticker, quantity }) => {

  const stratManager = require('../socket-server/strat-manager');
  const response = await limitSell({ ticker, quantity });
  const {
      alpacaOrder,
      attemptNum
  } = response || {};
  if (alpacaOrder && alpacaOrder.filled_at) {
      const currentPosition = stratManager.positions.alpaca.find(pos => pos.ticker === ticker);
      const deletedHold = await Holds.findOneAndDelete({
          ticker
      });
      await sendEmail(
          `wow sold ${ticker} in ${attemptNum} attempts`, 
          JSON.stringify({
              alpacaOrder,
              attemptNum,
              deletedHold,
              currentPosition
          }, null, 2)
      );
  } else {
      await sendEmail(`unable to sell ${ticker}`);
  }
  
};