// npm
const mapLimit = require('promise-map-limit');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const retryPromise = require('../utils/retry-promise');
const addFundamentals = require('../app-actions/add-fundamentals');

const request = require('request-promise');

module.exports = {
    name: 'best-st-sentiment',
    trendFilter: async (Robinhood, trend, min, priceKey) => {

        let stReqCount = 0;

        // helper fns
        const limitTrendByVolume = async (subTrend, countLimit = 45) => {
            const withFundamentals = await addFundamentals(Robinhood, subTrend);
            return withFundamentals
                .sort((a, b) => Number(b.fundamentals.volume) - Number(a.fundamentals.volume))
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

            console.log(withSentiment);

            return withSentiment;
        };

        const sortedByGenerator = withSentiment => 
            key => withSentiment
                .slice(0)
                .filter(o => o[key])
                .sort((a, b) => b[key] - a[key])
                .slice(0, 1)
                .map(o => o.ticker);

        const handleTrend = async (nameStr, subTrend) => {
            console.log(`handle ${nameStr} trend...`);
            const limitedByVolume = await limitTrendByVolume(subTrend);
            const withSentimented = await addSentimentToTrend(limitedByVolume);
            const sortedByFn = sortedByGenerator(withSentimented);

            const highestKeys = ['bullBearScore', 'withSentiment', 'withSentAndVol'];
            const perms = highestKeys.reduce((acc, key) => ({
                ...acc,
                [`${nameStr}-${key}`]: sortedByFn(key)
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
    run: [-25, 150, 300, 600],
    pricePermFilter: ['under5'] // only run under5
};