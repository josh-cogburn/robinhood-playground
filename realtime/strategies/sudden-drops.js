const getMultipleHistoricals = require('../../app-actions/get-multiple-historicals');
const getTrend = require('../../utils/get-trend');

module.exports = {
    period: [5, 10, 30],
    // collections: 'all',
    handler: async ({ ticker, allPrices }) => {
        const allCurrents = allPrices.map(obj => obj.currentPrice);
        const mostRecent = allCurrents.pop();
        const min = Math.min(...allCurrents);
        const trendFromMin = getTrend(mostRecent, min);
        const bigJump = trendFromMin < -5;

        if (!bigJump) return;

        // check against 5 minute historical data???
        let [fiveMinuteHistoricals] = await getMultipleHistoricals(
            Robinhood,
            [ticker],
            'interval=5minute&span=day'
        );
        fiveMinuteHistoricals = fiveMinuteHistoricals.map(o => o.close_price);
        const failedHistoricalCheck = fiveMinuteHistoricals.slice(0, -1).some(p => getTrend(p, mostRecent) < 5);
        if (failedHistoricalCheck) {
          return console.log('failed historical check', ticker);
        }

        // big jump and passed historical check...
        if (allPrices.length >= 3) {
            console.log('found big jump', ticker, trendFromMin);
            return {
              ticker,
              keys: {
                ...(jumpKey = () => {
                    const key = (() => {
                      if (trendFromMin > -8) return 'minorJump';
                      if (trendFromMin < -13) return 'majorJump';
                    })();
                    return { [key]: true };
                })()
              },
              data: {
                allCurrents,
                mostRecent,
                trendFromMin
              }
            };
        }
    },
    pms: {
        shouldWatchout: 'shouldWatchout',
        notWatchout: 'notWatchout',

        majorJumpLunch: ['majorJump', 'lunch'],
        majorJumpDinner: ['majorJump', 'dinner'],
    }
};