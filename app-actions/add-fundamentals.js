// utils
const getTrend = require('../utils/get-trend');
const chunkApi = require('../utils/chunk-api');




const fundamentalCache = {};
const REFRESH_CACHE = 1000 * 60;

module.exports = async (trend) => {

    const allTickers = trend.map(t => t.ticker);
    const tickersInCache = allTickers.filter(ticker =>
        Object.keys(fundamentalCache).includes(ticker)
    );
    const tickersInCacheAndNotExpired = tickersInCache.filter(ticker =>
        Date.now() - fundamentalCache[ticker].timestamp < REFRESH_CACHE
    );

    const tickersToLookup = allTickers.filter(ticker => 
        !tickersInCacheAndNotExpired.includes(ticker)
    );

    strlog({
        trend,
        tickersToLookup
    })

    console.log('adding fundamentals')
    let fundamentals = await chunkApi(
        tickersToLookup,
        async tickerStr => {
            // console.log('tickerstr', tickerStr);
            const response = await Robinhood.url(`https://api.robinhood.com/fundamentals/?symbols=${tickerStr}`);
            strlog({ response })
            return response.results;
        },
        10
    );

    strlog({ fundamentals})

    fundamentals
        .map(data => {
            [ 
                'open',
                'high',
                'low',
                'volume',
                'average_volume_2_weeks',
                'average_volume',
                'high_52_weeks',
                'dividend_yield',
                'float',
                'low_52_weeks',
                'market_cap',
                'pb_ratio',
                'pe_ratio',
                'shares_outstanding',
                // 'description',
                // 'instrument',
                // 'ceo',
                // 'headquarters_city',
                // 'headquarters_state',
                // 'sector',
                // 'industry',
                // 'num_employees',
                // 'year_founded' 
            ]
                .filter(key => data[key])
                .forEach(key => {
                    data[key] = Number(data[key]);
                });
            return data;
        })
        .forEach((data, i) => {
            const ticker = tickersToLookup[i];
            fundamentalCache[ticker] = {
                timestamp: Date.now(),
                data
            };
        });

    let withFundamentals = trend.map(obj => ({
        ...obj,
        fundamentals: fundamentalCache[obj.ticker].data
    }));

    return withFundamentals;

};
