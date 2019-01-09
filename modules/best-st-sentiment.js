// npm
const mapLimit = require('promise-map-limit');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const retryPromise = require('../utils/retry-promise');
const addFundamentals = require('../app-actions/add-fundamentals');

const request = require('request-promise');


const fieldSorter = (fields) => (a, b) => fields.map(o => {
    let dir = 1;
    if (o[0] === '-') { dir = -1; o=o.substring(1); }
    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
}).reduce((p, n) => p ? p : n, 0);

module.exports = {
    name: 'best-st-sentiment',
    trendFilter: async (Robinhood, trend, min, priceKey) => {

        let stReqCount = 0;

        // helper fns
        const limitTrendByVolume = async (subTrend, countLimit = 3) => {
            const withFundamentals = await addFundamentals(Robinhood, subTrend);
            return withFundamentals
                .map(o => ({
                    ...o,
                    volToAvg: Number(o.fundamentals.volume) / Number(o.fundamentals.average_volume_2_weeks)
                }))
                .filter(o => o.volToAvg)
                .sort((a, b) => b.volToAvg - a.volToAvg)
                .slice(0, countLimit);
        };

        const addSentimentToTrend = async trend => {
            const trendTicks = trend.map(o => o.ticker);
            console.log(trendTicks.length);
            console.log([...new Set(trendTicks)].length);

            let withSentiment = await mapLimit(trend, 3, async obj => {
                stReqCount = stReqCount + 3;
                console.log({ stReqCount });
                return {
                    ...obj,
                    ...await getStSentiment(null, obj.ticker, true)
                };
            });

            // console.log(withSentiment);

            return withSentiment;
        };

        const sortedByGenerator = withSentiment => 
            (key, order, count = 1) => {

                const keyStr = `${order === 'highest' ? '-' : ''}${key}`;
                const sortFn = fieldSorter([keyStr, '-volToAvg'])

                return withSentiment
                    .slice(0)
                    .filter(o => typeof o[key] !== 'undefined')
                    .sort(sortFn)
                    .slice(0, count)
                    .map(o => o.ticker);
            };

        const handleTrend = async (nameStr, subTrend) => {
            console.log(`handle ${nameStr} trend...`);
            const limitedByVolume = await limitTrendByVolume(subTrend);
            const withSentimented = (await addSentimentToTrend(limitedByVolume))
                .filter(o => typeof o.bullBearScore !== 'undefined');
            const sortedByFn = sortedByGenerator(withSentimented);

            const highestKeys = [
                'bullBearScore', 
                'withSentiment', 
                'withSentAndVol', 
                'mostRecentSentiment', 
                'todayVolumeChange', 
                'bearishCount', 
                'bullishCount'
            ];
            const perms = highestKeys.reduce((acc, key) => ({
                ...acc,
                [`${nameStr}-highest-${key}`]: sortedByFn(key, 'highest'),
                [`${nameStr}-lowest-${key}`]: sortedByFn(key, 'lowest'),
                [`${nameStr}-highest-${key}-first2`]: sortedByFn(key, 'highest', 2),
                [`${nameStr}-lowest-${key}-first2`]: sortedByFn(key, 'lowest', 2)
            }), {});
            return perms;
        };

        // start

        console.log('running best st-sentiment strategy', priceKey);

        // under5
        const under5perms = await handleTrend('under5', trend);
        // sp500
        const sp500url = 'https://pkgstore.datahub.io/core/s-and-p-500-companies/constituents_json/data/64dd3e9582b936b0352fdd826ecd3c95/constituents_json.json';
        const sp500perms = await handleTrend(
            'sp500',
            JSON.parse(
                await request(sp500url)
            ).map(o => ({ 
                ticker: o.Symbol 
            }))
        );

        // top100RH instruments tag
        console.log('getting top100RH');
        const {
            instruments: top100RHinstruments
        } = await Robinhood.url('https://api.robinhood.com/midlands/tags/tag/100-most-popular/')
        let top100RHtrend = await mapLimit(top100RHinstruments, 3, async instrumentUrl => {
            const instrumentObj = await Robinhood.url(instrumentUrl);
            return {
                ...instrumentObj,
                instrumentUrl,
                ticker: instrumentObj.symbol
            };
        });
        const top100RHperms = await handleTrend('top100RH', top100RHtrend);

        const returnObj = {
            ...under5perms,
            ...sp500perms,
            ...top100RHperms
        };

        console.log(JSON.stringify(returnObj, null, 2));
        console.log(`total stocktwits requests: ${stReqCount}`);

        return returnObj;
        
    },
    run: [-25, 150, 300, 400, 600],
    pricePermFilter: ['under5'] // only run under5
};