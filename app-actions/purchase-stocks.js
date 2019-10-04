const limitBuyMultiple = require('./limit-buy-multiple');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
let { expectedPickCount, purchaseAmt } = require('../settings');
const { alpaca } = require('../alpaca');


const purchaseStocks = async ({ strategy, multiplier = 1, min, withPrices, PickDoc } = {}, dontBuy) => {

    const account = await alpaca.getAccount();
    const { portfolio_value, buying_power } = account;
    // strlog({ account })
    purchaseAmt = purchaseAmt || Math.ceil(portfolio_value / expectedPickCount);
    const amountPerBuy = purchaseAmt * multiplier;
    strlog({
        purchaseAmt,
        multiplier,
        amountPerBuy,
    });
    const totalAmtToSpend = Math.min(amountPerBuy, buying_power);
    strlog({
        totalAmtToSpend,
        buying_power,
        strategy
    });
    
    if (dontBuy) return;

    // const totalAmtToSpend = cashAvailable * ratioToSpend;

    
    // console.log('multiplier', multiplier, 'amountPerBuy', amountPerBuy, 'totalAmtToSpend', totalAmtToSpend);

    // if (totalAmtToSpend < 10) {
    //     return console.log('not purchasing less than $10 to spend', strategy);
    // }


    // console.log('actually purchasing', strategy, 'count', stocksToBuy.length);
    // console.log('ratioToSpend', ratioToSpend);
    // console.log({ stocksToBuy, totalAmtToSpend });
    await limitBuyMultiple({
        totalAmtToSpend,
        strategy,
        min,
        withPrices,
        strategy,
        PickDoc
    });
};

module.exports = purchaseStocks;
