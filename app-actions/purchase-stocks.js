const limitBuyMultiple = require('./limit-buy-multiple');
const getMinutesFromOpen = require('../utils/get-minutes-from-open');
let { expectedPickCount, purchaseAmt, disableCashCheck } = require('../settings');
const { alpaca } = require('../alpaca');
const makeFundsAvailable = require('../alpaca/make-funds-available');
const sendEmail = require('../utils/send-email');

const purchaseStocks = async ({ strategy, multiplier = 1, min, withPrices } = {}, dontBuy) => {

    const account = await alpaca.getAccount();
    const { portfolio_value, cash, long_market_value } = account;

    purchaseAmt = purchaseAmt || Math.ceil(portfolio_value / expectedPickCount);
    const amountPerBuy = purchaseAmt * multiplier;
    strlog({
        purchaseAmt,
        multiplier,
        amountPerBuy,
    });

    if (!disableCashCheck && amountPerBuy * 1.3 > Number(cash)) {
        return console.log('YOU ARE OUT OF MONEY');
    }

    const totalAmtToSpend = disableCashCheck ? amountPerBuy : Math.min(amountPerBuy, cash);
    strlog({
        totalAmtToSpend,
        cash,
        strategy
    });

    if (totalAmtToSpend * 1.3 > cash) {
        const fundsNeeded = (totalAmtToSpend * 1.3) - cash;
        await makeFundsAvailable(fundsNeeded);
        const afterCash = (await alpaca.getAccount()).cash;
        await sendEmail('funds made available', JSON.stringify({ before: cash, fundsNeeded, after: afterCash }, null, 2));
    }

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
    });
};

module.exports = purchaseStocks;
