const recordPicks = require('../app-actions/record-picks');

module.exports = async Robinhood => {
    await recordPicks('watchout-blah-blah', 3000, [
        'FFHL'
    ]);
};