const activeSell = require('../app-actions/active-sell');
module.exports = async (Robinhood) => {

    await activeSell(Robinhood, {
        ticker: 'DLPN',
        quantity: 23
    });
}