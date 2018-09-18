const sells = require('../analysis/reports/sells');
const holds = require('../analysis/reports/holds');
const sendEmail = require('../utils/send-email');

module.exports = async Robinhood => {

    // TODO: bought, holding

    // DONE: sold
    const sellReport = await sells(Robinhood, 1);
    const holdReport = await holds(Robinhood);
    await sendEmail(
        `robinhood-playground: day-report`,
        [
            '--------------------',
            'CURRENT HOLDS',
            '--------------------',
            holdReport,
            '--------------------',
            'SELL REPORT',
            '--------------------',
            sellReport,
        ].join('\n')
    );
};