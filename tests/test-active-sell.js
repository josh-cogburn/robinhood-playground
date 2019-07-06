const activeSell = require('../app-actions/active-sell');
module.exports = async (ticker = 'CHK', quantity = 5) => {

    await activeSell({
        ticker,
        quantity: Number(quantity)
    });
}