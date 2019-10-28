const attemptSell = require('./attempt-sell');
const lookup = require('../utils/lookup');
const Holds = require('../models/Holds');
const sendEmail = require('../utils/send-email');
const getTrend = require('../utils/get-trend');

module.exports = async position => {

    const { 
        ticker, 
        quantity,
        percToSell
    } = position;
    
    // const { currentPrice } = await lookup(ticker);

    const response = await attemptSell({ 
        ticker, 
        quantity: Math.ceil(quantity * (percToSell / 100)),
        // limitPrice: currentPrice * .995,
        // timeoutSeconds: 60,
        fallbackToMarket: false
     });

    const { alpacaOrder, attemptNum } = response || {};
    console.log(`sold ${ticker} in ${attemptNum} attempts!!!`)
    if (!alpacaOrder || !alpacaOrder.filled_avg_price) {
        return sendEmail(`unable to sell ${ticker}`);
    }
    
  
};