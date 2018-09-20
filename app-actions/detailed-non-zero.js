const mapLimit = require('promise-map-limit');
const lookup = require('../utils/lookup');

module.exports = async (Robinhood) => {
    const { results: allPositions } = await Robinhood.nonzero_positions();
    console.log('getting detailed non zero');
    const withTicks = await mapLimit(allPositions, 1, async pos => {
        const instrument = await Robinhood.url(pos.instrument);
        const lookupObj = await lookup(Robinhood, instrument.symbol);
        return {
            ...pos,
            ...lookupObj,
            average_buy_price: Number(pos.average_buy_price),
            symbol: instrument.symbol,
            ticker: instrument.symbol,
            quantity: Number(pos.quantity),
        };
    });
    // console.log('made it', withTicks);
    return withTicks.filter(pos => pos.quantity);
};
