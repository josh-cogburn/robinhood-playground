const mapLimit = require('promise-map-limit');
const lookup = require('../utils/lookup');
const addBuyDataToPositions = require('../app-actions/add-buy-data-to-positions');
// const getAssociatedStrategies = require('./get-associated-strategies');
// const getStSentiment = require('../utils/get-stocktwits-sentiment');
// const positionOutsideBracket = require('../utils/position-outside-bracket');


const getPositions = async () => {
    const { results: allPositions } = await Robinhood.nonzero_positions();
    const formattedPositions = allPositions.map(pos => ({
        ...pos,
        average_buy_price: Number(pos.average_buy_price),
        quantity: Number(pos.quantity)
    }));
    const atLeastOneShare = formattedPositions.filter(pos => pos.quantity);
    console.log('getting detailed non zero');
    return mapLimit(atLeastOneShare, 1, async pos => {
        const instrument = await Robinhood.url(pos.instrument);
        console.log('looking up instrument', instrument.symbol);
        try {
            const lookupObj = await lookup(instrument.symbol);
            return {
                ...pos,
                ticker: instrument.symbol,
                ...lookupObj,
            };
        } catch (e) {
            console.log('unable to lookup', instrument.symbol);
        }
    });
};

const getDetailedNonZero = async () => {
    
    let formattedWithLookup = await getPositions();
    formattedWithLookup = formattedWithLookup.filter(Boolean);

    // console.log({ formattedWithLookup})
    
    const withBuyData = await addBuyDataToPositions(formattedWithLookup);

    const withEquity = withBuyData.map(pos => ({
        ...pos,
        equity: +(pos.currentPrice * pos.quantity).toFixed(2)
    })).sort((a, b) => b.equity - a.equity);

    const totalInvested = withEquity.reduce((acc, pos) => acc + pos.equity, 0);
    const withPercTotal = withEquity.map(pos => ({
        ...pos,
        percTotal: +(pos.equity / totalInvested * 100).toFixed(2)
    }));

    const withStSent = await mapLimit(withPercTotal, 3, async pos => ({
        ...pos,
        stSent: (await getStSentiment(pos.ticker) || {}).bullBearScore
    }));

    const withShouldSell = withStSent.map(pos => ({
        ...pos,
        // ...positionOutsideBracket(pos)
    }));

    // console.log('made it', withTicks);
    return withShouldSell;
};

module.exports = getDetailedNonZero;
module.exports.getPositions = getPositions;