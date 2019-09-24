const Combinatorics = require('js-combinatorics');
const getMultipleHistoricals = require('../../app-actions/get-multiple-historicals');
const getTrend = require('../../utils/get-trend');

module.exports = {
    period: [5, 10, 30],
    collections: ['fitty', 'options', 'spy', 'twoToFive', 'fiveToTen', 'lowVolumeTrash'],
    handler: async ({ ticker, allPrices }) => {
        const allCurrents = allPrices.slice(-20).map(obj => obj.currentPrice);
        const mostRecent = allCurrents.pop();
        const min = Math.min(...allCurrents);
        const trendFromMin = getTrend(mostRecent, min);
        const bigJump = trendFromMin < -5;

        if (!bigJump) return;

        console.log('found sudden drop', {
          allCurrents,
          trendFromMin
        })

        // check against 5 minute historical data???
        let [fiveMinuteHistoricals] = await getMultipleHistoricals(
            [ticker],
            'interval=5minute&span=day'
        );
        fiveMinuteHistoricals = fiveMinuteHistoricals.map(o => o.close_price);
        const failedHistoricalCheck = fiveMinuteHistoricals.slice(0, -1).some(p => getTrend(p, mostRecent) < 5);
        if (failedHistoricalCheck) {
          return console.log('failed historical check', ticker, mostRecent);
        }

        // big jump and passed historical check...
        if (allPrices.length >= 3) {
            console.log('found big jump', ticker, trendFromMin);
            return {
              keys: {
                ...(jumpKey = () => {
                    const key = (() => {
                      if (trendFromMin > -8) return 'minorJump';
                      if (trendFromMin < -13) return 'majorJump';
                      return 'mediumJump';
                    })();
                    return { [key]: true };
                })(),
                // [failedHistoricalCheck]: failedHistoricalCheck
              },
              data: {
                // allCurrents,
                mostRecent,
                trendFromMin
              }
            };
        }
    },
    pms: {


      ...Combinatorics.cartesianProduct(
        [
          'notWatchout',
          'shouldWatchout',
        ],
        [
          'majorJump',
          'minorJump',
          'mediumJump'
        ],
        [
          'dinner',
          'lunch',
          'brunch',
          'initial'
        ]
      ).toArray().reduce((acc, arr) => {

        return {
          ...acc,
          ...Combinatorics.power(arr)
            .toArray()
            .filter(s => s && s.length)
            .reduce((inner, combo) => ({
              ...inner,
              [combo.join('-')]: combo
            }), {})
        }

      }, {})

    }
};