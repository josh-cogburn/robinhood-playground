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
    let formattedWithLookup = await mapLimit(atLeastOneShare, 1, async pos => {
        const instrument = await Robinhood.url(pos.instrument);
        console.log('looking up instrument', instrument.symbol);
        try {
            const lookupObj = await lookup(Robinhood, instrument.symbol);
            return {
                ...pos,
                ticker: instrument.symbol,
                ...lookupObj,
            };
        } catch (e) {
            console.log('unable to lookup', instrument.symbol);
        }
    });

    formattedWithLookup = formattedWithLookup.filter(Boolean);

    // console.log({ formattedWithLookup})
    
    const finalNonZeroPositions = await addBuyDataToPositions(formattedWithLookup);
    // console.log('made it', withTicks);
    return finalNonZeroPositions;
};

module.exports = getDetailedNonZero;