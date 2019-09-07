const limitBuyMultiple = require('./limit-buy-multiple');
const getMinutesFrom630 = require('../utils/get-minutes-from-630');
const { purchaseAmt } = require('../settings');

const purchaseStocks = async ({ stocksToBuy, strategy, multiplier = 1, min, withPrices }) => {
    const accounts = await Robinhood.accounts();
    // const ratioToSpend = Math.max(0.3, getMinutesFrom630() / 390);
    const cashAvailable = Number(accounts.results[0].margin_balances.unallocated_margin_cash);
    // const totalAmtToSpend = cashAvailable * ratioToSpend;

    const amountPerBuy = purchaseAmt * multiplier;
    const totalAmtToSpend = amountPerBuy;//Math.min(amountPerBuy, cashAvailable);
    // console.log('multiplier', multiplier, 'amountPerBuy', amountPerBuy, 'totalAmtToSpend', totalAmtToSpend);

    // if (totalAmtToSpend < 10) {
    //     return console.log('not purchasing less than $10 to spend', strategy);
    // }


    // console.log('actually purchasing', strategy, 'count', stocksToBuy.length);
    // console.log('ratioToSpend', ratioToSpend);
    console.log('totalAmtToSpend', totalAmtToSpend, 'amtperbuy', amountPerBuy);
    console.log({ stocksToBuy, totalAmtToSpend });
    await limitBuyMultiple({
        stocksToBuy,
        totalAmtToSpend,
        strategy,
        min,
        withPrices
    });
};

module.exports = purchaseStocks;
