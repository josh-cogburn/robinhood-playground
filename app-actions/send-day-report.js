const sells = require('../analysis/reports/sells');
const holds = require('../analysis/reports/holds');
const sendEmail = require('../utils/send-email');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');

module.exports = async Robinhood => {

    const todaysDate = (await getFilesSortedByDate('daily-transactions'))[0];
    const sellReport = await sells(Robinhood, 1);
    const holdReport = await holds(Robinhood);
    await sendEmail(
        `robinhood-playground: day-report for ${todaysDate}`,
        [
            '-----------------------------------',
            'CURRENT HOLDS',
            '-----------------------------------',
            holdReport,
            '',
            '-----------------------------------',
            'SELL REPORT',
            '-----------------------------------',
            sellReport,
        ].join('\n')
    );
};