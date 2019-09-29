const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
// const shouldYouSellThisStock = require('../analysis/should-you-sell-this-stock');
const shouldSellPosition = require('../utils/should-sell-position');
const getStSent = require('../utils/get-stocktwits-sentiment');
const Holds = require('../models/Holds');
const sendEmail = require('../utils/send-email');
const limitSell = require('./limit-sell');

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
    for (let { ticker, qty } of toSell) {
        const response = await limitSell({ ticker, quantity: qty });
        const {
            alpacaOrder,
            attemptNum
        } = response || {};
        if (alpacaOrder && alpacaOrder.filled_at) {
            const deletedHold = await Holds.findOneAndDelete({
                ticker
            });
            await sendEmail(
                `wow sold ${ticker} in ${attemptNum} attempts`, 
                JSON.stringify({
                    alpacaOrder,
                    attemptNum,
                    deletedHold
                }, null, 2)
            );
        } else {
            await sendEmail(`unable to sell ${ticker}`);
        }
    }
};