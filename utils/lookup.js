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
    const quoteDataResponse = await Robinhood.quote_data(ticker);
    const originalQuoteData = quoteDataResponse.results[0];
    const { 
        last_trade_price, 
        adjusted_previous_close,
        instrument,
        ask_price,
        bid_price,
        last_extended_hours_trade_price
    } = originalQuoteData;
    let additionalData = {
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
        ...originalQuoteData,
        ...additionalData,
        yahooPrice,
        currentPrice: additionalData.lastTrade || yahooPrice,
    };
    // console.log(data, 'data');
    return data;
};
