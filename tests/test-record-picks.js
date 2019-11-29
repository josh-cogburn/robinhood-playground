const recordPicks = require('../app-actions/record-picks');

module.exports = async Robinhood => {
    await recordPicks('sudden-drops-hotSt-5min-minorJump-avgh10-straightDown30-firstAlert-bearish-initial-5000', 3000, [
        'CFRX'
    ]);
};