// npm
const mapLimit = require('promise-map-limit');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const retryPromise = require('../utils/retry-promise');
const addFundamentals = require('../app-actions/add-fundamentals');

const request = require('request-promise');
const getTrendSinceOpen = require('../rh-actions/get-trend-since-open');

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
        const limitTrendByVolume = async (subTrend, countLimit = 4) => {


            if (!subTrend[0].hasOwnProperty('quote_data')) {
                // console.log('before sub', subTrend);
                subTrend = await getTrendSinceOpen(Robinhood, subTrend.map(t => t.ticker));
                // console.log('after sub', subTrend);
            }

            let withFundamentals = await addFundamentals(Robinhood, subTrend);
            // console.log(withFundamentals)
            withFundamentals = withFundamentals
                .filter(o => 
                    o.fundamentals && o.fundamentals.volume && o.fundamentals.average_volume_2_weeks
                );
            console.log(withFundamentals.length, 'before')
            // withFundamentals = withFundamentals.filter(o => Math.abs(o.trend_since_prev_close) < 2.5);
            // console.log(withFundamentals.length, 'trend2')
            withFundamentals = withFundamentals
                .map(o => ({
                    ...o,
                    volToAvg: Number(o.fundamentals.volume) / Number(o.fundamentals.average_volume_2_weeks),
                    volume: o.fundamentals.volume
                }))
            withFundamentals = withFundamentals.filter(o => o.volume > 80000);
            console.log(withFundamentals.length, 'volume gt 80k')
            
            // str({ withFundamentals })
            
            const response = [];
            [
                'volToAvg',  
                'volume'
            ].forEach((sortKey, i) => {
                const sorted = withFundamentals
                    .sort((a, b) => b[sortKey] - a[sortKey])
                    .filter(pos => Boolean(pos[sortKey]));
                // str({ sortKey, sorted })
                let t = 0;
                while (t < sorted.length && response.length < Math.floor(countLimit / 2 * (i + 1))) {
                    const stock = sorted[t];
                    if (stock && response.find(obj => obj && obj.ticker === stock.ticker) === undefined) {
                        response.push(stock);
                    }
                    t++;
                }
                log('done', sortKey);
                str({ response: response.map(r => r.ticker) });
            });
            return response;

            // return withFundamentals.sort((a, b) => b.volume - a.volume).slice(0, countLimit);
        };

        const addSentimentToTrend = async trend => {
            const trendTicks = trend.map(o => o.ticker);
            console.log(trendTicks.length);
            console.log([...new Set(trendTicks)].length);

            let withSentiment = await mapLimit(trend, 1, async obj => {
                stReqCount = stReqCount + 3;
                console.log({ stReqCount });
                return {
                    ...obj,
                    ...await getStSentiment(null, obj.ticker)
                };
            });

            // console.log(withSentiment);

            return withSentiment;
        };

        const sortedByGenerator = withSentiment => 
            (key, order, count = 1, filterFn = () => true) => {

                const keyStr = `${order === 'highest' ? '-' : ''}${key}`;
                const sortFn = fieldSorter([keyStr, '-volToAvg'])

                return withSentiment
                    .slice(0)
                    .filter(o => typeof o[key] !== 'undefined')
                    .filter(filterFn)
                    .sort(sortFn)
                    .slice(0, count)
                    .map(o => o.ticker);
            };

        const handleTrend = async (nameStr, subTrend) => {
            console.log(`handle ${nameStr} trend...`);
            // console.log(subTrend);
            const limitedByVolume = await limitTrendByVolume(subTrend);
            // log(' done done o')
            // str({ limitedByVolume })
            const withSentimented = (await addSentimentToTrend(limitedByVolume))
                .filter(o => o.bullBearScore);
            str({ withSentimented })
            const sortedByFn = sortedByGenerator(withSentimented);

            const highestKeys = [
                'bullBearScore', 
                // 'withSentiment', 
                // 'withSentAndVol', 
                // 'mostRecentSentiment', 
                // 'todayVolumeChange', 
                'bearishCount', 
                'bullishCount'
            ];
            const trendPerms = {
                '': undefined,
                tscPosLt2pt5: o => o.trend_since_prev_close < 2.5 && o.trend_since_prev_close > 0,
                tscLt2pt5: o => Math.abs(o.trend_since_prev_close) < 2.5,
            };
            const handleTrendPerm = (trendPermKey, trendPermFn) => {
                const baseKey = [nameStr, trendPermKey].filter(Boolean).join('-');
                return highestKeys.reduce((acc, key) => ({
                    ...acc,
                    [`${baseKey}-highest-${key}`]: sortedByFn(key, 'highest', undefined, trendPermFn),
                    [`${baseKey}-lowest-${key}`]: sortedByFn(key, 'lowest', undefined, trendPermFn),
                    [`${baseKey}-highest-${key}-first2`]: sortedByFn(key, 'highest', 2, trendPermFn),
                    [`${baseKey}-lowest-${key}-first2`]: sortedByFn(key, 'lowest', 2, trendPermFn),
                }), {});
            };
            const perms = Object.keys(trendPerms).reduce((acc, key) => ({
                ...acc,
                ...handleTrendPerm(key, trendPerms[key])
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
    run: [-25, 80, 130, 190, 270],
    pricePermFilter: ['under5'] // only run under5
};