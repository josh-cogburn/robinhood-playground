const stratManager = require('../socket-server/strat-manager');

module.exports = async Robinhood => {
    await stratManager.init();
    // setTimeout(() => {
        console.log(
            'report',
            stratManager.calcPmPerfs()
        );
    // }, 60000);
};