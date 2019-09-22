const limitBuyMultiple = require('./limit-buy-multiple');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
// const { purchaseAmt } = require('../settings');
const { alpaca } = require('../alpaca');


const purchaseStocks = async ({ stocksToBuy, strategy, multiplier = 1, min, withPrices } = {}) => {

    const { portfolio_value, buying_power } = await alpaca.getAccount();
    const purchaseAmt = portfolio_value / 30;
    const amountPerBuy = purchaseAmt * multiplier;
    const totalAmtToSpend = Math.min(amountPerBuy, buying_power);
    strlog({
        purchaseAmt,
        amountPerBuy,
        multiplier,
        totalAmtToSpend,
        buying_power
    });

    // const totalAmtToSpend = cashAvailable * ratioToSpend;

    
    // console.log('multiplier', multiplier, 'amountPerBuy', amountPerBuy, 'totalAmtToSpend', totalAmtToSpend);

    // if (totalAmtToSpend < 10) {
    //     return console.log('not purchasing less than $10 to spend', strategy);
    // }


    // console.log('actually purchasing', strategy, 'count', stocksToBuy.length);
    // console.log('ratioToSpend', ratioToSpend);
    // console.log({ stocksToBuy, totalAmtToSpend });
    await limitBuyMultiple({
        stocksToBuy,
        totalAmtToSpend,
        strategy,
        min,
        withPrices
    });
};

module.exports = purchaseStocks;
