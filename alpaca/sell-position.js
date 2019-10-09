const attemptSell = require('./attempt-sell');
const Holds = require('../models/Holds');
const sendEmail = require('../utils/send-email');
const getTrend = require('../utils/get-trend');

module.exports = async position => {

    const { 
        symbol: ticker, 
        qty: quantity 
    } = position;

    const response = await attemptSell({ ticker, quantity });
    const { alpacaOrder, attemptNum } = response || {};
    if (!alpacaOrder || !alpacaOrder.filled_at) {
        return sendEmail(`unable to sell ${ticker}`);
    }
    
  
};