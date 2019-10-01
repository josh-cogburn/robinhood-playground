const limitSell = require('./limit-sell');
const Holds = require('../models/Holds');
const sendEmail = require('../utils/send-email');

module.exports = async ({ ticker, quantity }) => {

    const stratManager = require('../socket-server/strat-manager');
    const response = await limitSell({ ticker, quantity }) || {};
    const { alpacaOrder } = response || {};
    if (alpacaOrder && alpacaOrder.filled_at) {
        const currentPosition = stratManager.positions.alpaca.find(pos => pos.ticker === ticker);
        const deletedHold = await Holds.findOneAndDelete({
            ticker
        });
        const data = {
            alpacaOrder,
            attemptNum: response.attemptNum,
            deletedHold,
            currentPosition
        };
        const {
            alpacaOrder: {
                filled_avg_price: sellPrice
            },
            attemptNum,
            currentPosition: {
                quantity,
                average_buy_price: buyPrice,
                buyStrategies
            }
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
                deletedHold
            }, null, 2)
        );
    } else {
        await sendEmail(`unable to sell ${ticker}`);
    }
  
};