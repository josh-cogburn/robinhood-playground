// npm
const mapLimit = require('promise-map-limit');
const getStSentiment = require('../utils/get-stocktwits-sentiment');
const retryPromise = require('../utils/retry-promise');
const addFundamentals = require('../app-actions/add-fundamentals');

const request = require('request-promise');

module.exports = {
    name: 'best-st-sentiment',
    trendFilter: async (Robinhood, trend, min, priceKey) => {





        // top 100 volume of sp500

        // const sp500Tickers = JSON.parse(
        //     await request('https://pkgstore.datahub.io/core/s-and-p-500-companies/constituents_json/data/64dd3e9582b936b0352fdd826ecd3c95/constituents_json.json')
        // ).map(o => o.Symbol);


        // const withFundamentals = await addFundamentals(Robinhood, sp500Tickers.map(ticker => ({ ticker })))
        // const top100Volume = withFundamentals
        //     .sort((a, b) => Number(b.fundamentals.volume) - Number(a.fundamentals.volume))
        //     .slice(0, 100);
        // console.log(top100Volume)






        // top100 rh instruments tag

        // const { 
        //     instruments: top100RHinstruments
        // } = await Robinhood.url('https://api.robinhood.com/midlands/tags/tag/100-most-popular/');
        // console.log({ top100RHinstruments});
        // const detailedInstruments = await mapLimit(top100RHinstruments, 3, Robinhood.url);
        // const onlyTickers = detailedInstruments.map(t => t.symbol);


        // console.log('done getting instrument details');
        // console.log({ top100Volume });






        // console.log(trend.map(o => o.ticker).length);
        // console.log([...new Set(trend.map(o => o.ticker))].length);

        console.log('running best st-sentiment strategy', priceKey)
        const withFundamentals = await addFundamentals(Robinhood, trend);
        const topVolume = withFundamentals
            .sort((a, b) => Number(b.fundamentals.volume) - Number(a.fundamentals.volume))
            .slice(0, 50);
        console.log(topVolume)


        const trendTicks = topVolume.map(o => o.ticker);
        console.log(trendTicks);
        console.log([...new Set(trendTicks)]);

        let withSentiment = await mapLimit(trendTicks, 3, async ticker => ({
            ticker,
            ...await getStSentiment(null, ticker, true)
        }));

        const sortedBy = key => withSentiment
            .slice(0)
            .filter(o => o[key])
            .sort((a, b) => b[key] - a[key])
            .slice(0, 3)
            .map(o => o.ticker);
            
        console.log({ withSentiment });

        return {
            bullBearScore: sortedBy('bullBearScore'),
            withSentiment: sortedBy('withSentiment'),
            withSentAndVol: sortedBy('withSentAndVol')
        };
        
    },
    run: [-25, 150, 300, 600],
    priceFilter: ['under5'] // only run under5
};