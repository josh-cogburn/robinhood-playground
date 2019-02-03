const detailedNonZero = require('./detailed-non-zero');
const shouldYouSellThisStock = require('../analysis/should-you-sell-this-stock');
const simpleSell = require('./simple-sell');
const sendEmail = require('../utils/send-email');

module.exports = async Robinhood => {
    const nonZero = await detailedNonZero(Robinhood);

    const withShouldSells = await mapLimit(nonZero, 3, async pos => ({
        ...pos,
        shouldSell: await shouldYouSellThisStock(Robinhood, pos.ticker, pos.average_buy_price)
    }));
    str({ withShouldSells })

    withShouldSells[2].shouldSell = true;
    withShouldSells[3].shouldSell = true;

    const toSell = withShouldSells
        .filter(pos => pos.shouldSell)
        .sort((a, b) => b.returnDollars - a.returnDollars);


    log('to sell: ', toSell.map(pos => pos.ticker));

    await mapLimit(toSell, 3, async pos => {
        const { ticker, quantity } = pos;
        try {
            const response = await simpleSell(
                Robinhood,
                { ticker, quantity }
            );
            console.log(`sold ${quantity} shares of ${ticker}`, response);
            await sendEmail(`robinhood-playground: sold ${ticker}`, pos);
        } catch (e) {
            console.log(`error selling ${ticker}`, e);
            await sendEmail(`robinhood-playground: ERROR selling ${ticker}`, [
                ...pos,
                `error: ${e}`
            ].join('\n'));
        }
    });
    
};