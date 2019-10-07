const attemptSell = require('./attempt-sell');
const Holds = require('../models/Holds');
const sendEmail = require('../utils/send-email');
const getTrend = require('../utils/get-trend');

module.exports = async position => {

    const { 
        symbol: ticker, 
        qty: quantity 
    } = position;

    const stratManager = require('../socket-server/strat-manager');
    const response = await attemptSell({ ticker, quantity });
    const { alpacaOrder, attemptNum } = response || {};
    if (!alpacaOrder || !alpacaOrder.filled_at) {
        return sendEmail(`unable to sell ${ticker}`);
    }
    const currentPosition = stratManager.positions.alpaca.find(pos => pos.ticker === ticker);
    const deletedHold = await Holds.findOneAndDelete({ ticker });
    const data = {
        alpacaOrder,
        attemptNum,
        deletedHold,
        currentPosition
    };
    const {
        alpacaOrder: {
            filled_avg_price: sellPrice
        } = {},
        currentPosition: {
            average_buy_price: buyPrice,
            buyStrategies
        } = {}
    } = data;
    const returnDollars = (sellPrice - buyPrice) * quantity;
    const returnPerc = getTrend(sellPrice, buyPrice);
    await sendEmail(
        `wow sold ${ticker} return... ${returnDollars} (${returnPerc}%)`, 
        JSON.stringify({
            ticker,
            buyPrice,
            sellPrice,
            quantity,
            attemptNum,
            buyStrategies,
            alpacaOrder,
            deletedHold,
            position
        }, null, 2)
    );
  
};