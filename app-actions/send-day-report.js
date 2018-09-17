const sellingStrategy = require('../analysis/selling-strategy');
const sendEmail = require('../utils/send-email');

module.exports = async Robinhood => {

    // TODO: bought, holding

    // DONE: sold
    const sellReport = await sellingStrategy(Robinhood, 1);
    await sendEmail(
        `robinhood-playground: day-report`,
        sellReport
    );
};