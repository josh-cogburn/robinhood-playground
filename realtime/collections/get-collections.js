const getFinvizCollections = require('./get-finviz-collections');
const getStockInvestCollections = require('./get-stockinvest-collections');

const allStocks = require('../../json/stock-data/allStocks');
const lookupMultiple = require('../../utils/lookup-multiple');
const { isTradeable } = require('../../utils/filter-by-tradeable');
const { mapObject } = require('underscore');

const OPTIONSTICKERS = [

    'SPY',  // NOPE!


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
        const tickPrices = await lookupMultiple(allStocks.filter(isTradeable).map(o => o.symbol));
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

    

    let response = {
        spy: ['SPY'],
        options: OPTIONSTICKERS,
        // zeroAndOne: await getTickersBetween(0, 1),
        // upcoming: await getRhStocks('upcoming-earnings'),
        rhtop100: await getRhStocks('100-most-popular'),
        // ...await getFinvizCollections(),
        // ...await getStockInvestCollections()
    };

    // remove any tickers that are not available on     const getTicks = () => Object.values(response).flatten().uniq();
    const getTicks = () => Object.values(response).flatten().uniq();
    const originalTickers = getTicks();
    const badTickers = originalTickers.filter(ticker => 
        !allStocks.find(stock => stock.symbol === ticker)
    );
    console.log(`all ticker stock count: ${originalTickers.length}`);
    strlog({ badTickers });
    
    response = mapObject(
        response, 
        tickers => (tickers || []).filter(ticker => 
            !badTickers.includes(ticker)
        )
    );

    strlog(mapObject(response, v => v.length));
    console.log(`without bad stock count: ${getTicks().length}`);

    return response;

};