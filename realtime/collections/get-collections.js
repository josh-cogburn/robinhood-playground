const getFinvizCollections = require('./get-finviz-collections');
const lookupMultiple = require('../../utils/lookup-multiple');
const allStocks = require('../../json/stock-data/allStocks');
const { isTradeable } = require('../../utils/filter-by-tradeable');

const OPTIONSTICKERS = [
    'SPY',
    'GDX',
    'QQQ',
    'GLD',
    // 'VXX',


    'AAPL',
    // 'NFLX',
    'AMZN',
    'GOLD',
    'ABBV',


    'F',
    'FXC',
    'RIG',
    'BAC',
    'S',
    'NOK',
    'AVYA'
    // 'TXBA'
];




module.exports = async () => {

    const getTickersBetween = async (min, max) => {
        const tickPrices = await lookupMultiple(Robinhood, allStocks.filter(isTradeable).map(o => o.symbol));
        const tickers = Object.keys(tickPrices).filter(ticker => tickPrices[ticker] < max && tickPrices[ticker] > min);
        // console.log({ kstTickers: tickers });
        return tickers;
    };

    const getRhStocks = async rhTag => {
        console.log(`getting robinhood ${rhTag} stocks`);
        const {
            instruments: top100RHinstruments
        } = await Robinhood.url(`https://api.robinhood.com/midlands/tags/tag/${rhTag}/`);
        let top100RHtrend = await mapLimit(top100RHinstruments, 3, async instrumentUrl => {
            const instrumentObj = await Robinhood.url(instrumentUrl);
            return {
                ...instrumentObj,
                instrumentUrl,
                ticker: instrumentObj.symbol
            };
        });
        return top100RHtrend.map(t => t.ticker);
    };

    

    const response = {
        options: OPTIONSTICKERS,
        // zeroAndOne: await getTickersBetween(0, 1),
        // upcoming: await getRhStocks('upcoming-earnings'),
        top100: await getRhStocks('100-most-popular'),
        ...await getFinvizCollections(),
    };

    strlog(response);
    console.log(`total stock count: ${Object.values(response).flatten().uniq().length}`);

    return response;

};