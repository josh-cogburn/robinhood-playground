const recordPicks = require('../app-actions/record-picks');

module.exports = async Robinhood => {
    await recordPicks('low-float-high-volume-floatTimesfloatToVolume-trendgt20', 6, [
        'AAPL'
    ]);
};