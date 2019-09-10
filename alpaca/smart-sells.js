const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
// const shouldYouSellThisStock = require('../analysis/should-you-sell-this-stock');
const shouldSellPosition = require('../utils/should-sell-position');
const getStSent = require('../utils/get-stocktwits-sentiment');

module.exports = async (dontSell) => {
    console.log({ dontSell })
    let positions = (
        await alpaca.getPositions()
    ).map(pos => ({
        ...pos,
        returnPerc: Number(pos.unrealized_plpc) * 100,
        ticker: pos.symbol
    }));
    
    positions = await mapLimit(positions, 3, async pos => ({
        ...pos,
        stSent: (await getStSent(pos.ticker) || {}).bullBearScore || 0
    }));

    positions = positions.map(pos => ({
        ...pos,
        shouldSell: shouldSellPosition(pos)
    }));

    // positions = positions.filter(pos => !keep.includes(pos.symbol));
    // str({ positions })
    // const withShouldSells = await mapLimit(positions, 3, async pos => ({
    //     ...pos,
    //     shouldSell: await shouldYouSellThisStock(pos.symbol, pos.avg_entry_price)
    // }));

    // log('selling' + withShouldSells.map(p => p.symbol));

    // str({ withShouldSells })

    const toSell = positions.filter(pos => pos.shouldSell);
    strlog({
        toSell: toSell.map(pos => pos.symbol)
    })
    if (dontSell) {
        console.log('dont sell alpaca....returning!')
        return;
    };
    for (let pos of toSell) {
        const order = await alpaca.createOrder({
            symbol: pos.symbol, // any valid ticker symbol
            qty: Number(pos.qty),
            side: 'sell',
            type: 'market',
            time_in_force: 'day',
        });
        log(order)
    }
};