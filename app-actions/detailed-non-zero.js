const mapLimit = require('promise-map-limit');
const lookup = require('../utils/lookup');
const addBuyDataToPositions = require('../app-actions/add-buy-data-to-positions');
// const getAssociatedStrategies = require('./get-associated-strategies');

const getDetailedNonZero = async (Robinhood) => {
    const { results: allPositions } = await Robinhood.nonzero_positions();
    const formattedPositions = allPositions.map(pos => ({
        ...pos,
        average_buy_price: Number(pos.average_buy_price),
        quantity: Number(pos.quantity)
    }));
    const atLeastOneShare = formattedPositions.filter(pos => pos.quantity);
    console.log('getting detailed non zero');
    const formattedWithLookup = await mapLimit(atLeastOneShare, 1, async pos => {
        const instrument = await Robinhood.url(pos.instrument);
        console.log('instrument', instrument, 'sym', instrument.symbol)
        const lookupObj = await lookup(Robinhood, instrument.symbol);
        return {
            ...pos,
            ticker: instrument.symbol,
            ...lookupObj,
        };
    });

    console.log({ formattedWithLookup})
    
    const finalNonZeroPositions = await addBuyDataToPositions(formattedWithLookup);
    // console.log('made it', withTicks);
    return finalNonZeroPositions;
};

module.exports = getDetailedNonZero;