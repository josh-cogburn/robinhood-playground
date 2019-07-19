const getFinvizCollections = require('./get-finviz-collections');
const getStockInvestCollections = require('./get-stockinvest-collections');
const getRisk = require('../../rh-actions/get-risk');
const addFundamentals = require('../../app-actions/add-fundamentals');

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
    'AVYA',
    // 'TXBA'


    'GM',
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
    
    // const withRisk = await mapLimit(originalTickers, 3, async ticker => {
    //     const obj = {
    //         ticker,
    //         ...await getRisk({ticker})
    //     };
    //     console.log(obj);
    //     return obj;
    // });

    // strlog({withRisk});

    console.log(`all ticker stock count: ${originalTickers.length}`);


    // ONLY TRADEABLE TICKERS

    const badTickers = originalTickers.filter(ticker => 
        !allStocks.find(stock => stock.symbol === ticker)
    );

    strlog({ badTickers });
    
    response = mapObject(
        response, 
        tickers => (tickers || []).filter(ticker => 
            !badTickers.includes(ticker)
        )
    );

    strlog(mapObject(response, v => v.length));
    console.log(`without bad stock count: ${getTicks().length}`);

    // ONLY THE "GOOD STUFF"


    Array.prototype.cutBottomQuarter = function() {
        const length = this.length;
        const quarter = (length / 4);
        console.log('cutting', quarter);
        return this.slice(0, length - quarter);
    };

    const withFundamentals = await addFundamentals(originalTickers.map(ticker => ({ ticker })));

    console.log({ withFundamentals: withFundamentals.length})
    const withVolToAvg = withFundamentals
        .map(obj => ({
            ...obj,
            volToAvg: obj.fundamentals.volume / obj.fundamentals.average_volume
        }))
        .filter(obj => obj.volToAvg)
        .sort((a, b) => b.volToAvg - a.volToAvg)
        .cutBottomQuarter();

    console.log({ withVolToAvg: withVolToAvg.length});
    
    const sortedByMarketCap = withVolToAvg
        .sort((a, b) => b.fundamentals.market_cap - a.fundamentals.market_cap)
        .cutBottomQuarter();

    strlog({sortedByMarketCap: sortedByMarketCap.length});

    const sortedByPrice = sortedByMarketCap
        .sort((a, b) => b.fundamentals.open - a.fundamentals.open)
        .cutBottomQuarter();
    strlog({ sortedByPrice: sortedByPrice.length });

    const theGoodStuff = sortedByPrice.map(obj => obj.ticker);

    response = mapObject(
        response, 
        tickers => (tickers || []).filter(ticker => 
            theGoodStuff.includes(ticker)
        )
    );

    strlog(mapObject(response, v => v.length));
    console.log(`only the good stuff: ${getTicks().length}`);

    return response;

};