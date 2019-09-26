const Combinatorics = require('js-combinatorics');
const getMultipleHistoricals = require('../../app-actions/get-multiple-historicals');
const getTrend = require('../../utils/get-trend');

module.exports = {
    period: [5, 10],
    collections: ['fitty', 'options', 'spy', 'twoToFive', 'fiveToTen', 'lowVolumeTrash'],
    handler: async ({ ticker, allPrices }) => {

        // const onlyToday = (() => {
        //   const todayDate = (new Date()).getDate();
        //   return allPrices
        //     .filter(({ timestamp }) => 
        //       (new Date(timestamp)).getDate() === todayDate
        //     );
        // })();

        // if (onlyToday.length < 5) return;
        const lowVolCount = allPrices.filter(({ volume }) => volume < 1500).length;
        const lowVolWarning = lowVolCount / allPrices.length > 0.15;

        const currentsToday = allPrices.slice(-45).map(({ currentPrice }) => currentPrice);
        const mostRecent = currentsToday.pop();
        const min = Math.min(...currentsToday);
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
                lowVolWarning,
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