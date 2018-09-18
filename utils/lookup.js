// lookup ticker last trade price
// ticker -> {
//     last_trade_price,
//     previous_close,
//     yahooPrice,
//     instrument
// }
const { lookup } = require('yahoo-stocks');

module.exports = async (Robinhood, ticker) => {
    // console.log('looking up', ticker);
    const quoteData = await Robinhood.quote_data(ticker);
    const { 
        last_trade_price, 
        adjusted_previous_close, 
        instrument,
        ask_price,
        bid_price,
        last_extended_hours_trade_price
    } = quoteData.results[0];
    let data = {
        lastTrade: Number(last_trade_price),
        prevClose: Number(adjusted_previous_close),
        askPrice: Number(ask_price),
        bidPrice: Number(bid_price),
        afterHoursPrice: Number(last_extended_hours_trade_price),
        instrument,
    };
    try {
        var yahooPrice = (await lookup(ticker)).currentPrice;
    } catch (e) {}
    data = {
        ...data,
        yahooPrice,
        currentPrice: data.lastTrade || yahooPrice
    };
    // console.log(data, 'data');
    return data;
};
