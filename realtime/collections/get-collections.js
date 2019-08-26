const getFinvizCollections = require('./get-finviz-collections');
const getStockInvestCollections = require('./get-stockinvest-collections');
const getRisk = require('../../rh-actions/get-risk');
const addFundamentals = require('../../app-actions/add-fundamentals');

const allStocks = require('../../json/stock-data/allStocks');
const lookupMultiple = require('../../utils/lookup-multiple');
const { isTradeable } = require('../../utils/filter-by-tradeable');
const { mapObject } = require('underscore');
const { getPositions } = require('../../app-actions/detailed-non-zero');

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
    // 'FXC',
    // 'RIG',
    'BAC',
    'S',
    // 'NOK',
    'AVYA',
    // 'TXBA'


    'GM',
];


const filterForTheGood = async tickers => {

    const withFundamentals = await addFundamentals(
        tickers
            .filter(ticker => !OPTIONSTICKERS.includes(ticker))
            .map(ticker => ({ ticker }))
    );

    console.log({ withFundamentals: withFundamentals.length})

    const topVol = withFundamentals
        .sort((a, b) => b.fundamentals.volume - a.fundamentals.volume)
        .cutBottom();

    console.log({ topVol: topVol.length})
    
    const withVolToAvg = topVol
        .map(obj => ({
            ...obj,
            volToAvg: obj.fundamentals.volume / obj.fundamentals.average_volume
        }))
        .filter(obj => obj.volToAvg)
        .sort((a, b) => b.volToAvg - a.volToAvg)
        .cutBottom();

    console.log({ withVolToAvg: withVolToAvg.length});
    
    // const sortedByMarketCap = withVolToAvg
    //     .sort((a, b) => b.fundamentals.market_cap - a.fundamentals.market_cap)
    //     .cutBottom();

    // strlog({sortedByMarketCap: sortedByMarketCap.length});



    let i = 0;
    const withRisk = await mapLimit(withVolToAvg, 5, async obj => {
        const response = {
            ...obj,
            ...await getRisk({ ticker: obj.ticker })
        };
        console.log(++i, '/', withVolToAvg.length );
        return response;
    });

    const sortedBySumMostRecent = withRisk
        // .filter(obj => obj.sumMostRecent > 0)
        .sort((a, b) => b.sumMostRecent - a.sumMostRecent)
        .cutBottom();

    console.log({ sortedBySumMostRecent: sortedBySumMostRecent.length})

    const theGoodStuff = sortedBySumMostRecent.map(obj => obj.ticker);
    return theGoodStuff;
}



module.exports = async () => {

    console.log('get collections!');

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

    strlog({
        // detailedNonZero,
        // d: detailedNonZero.getPositions
    })

    let response = {
        spy: ['SPY'],
        options: OPTIONSTICKERS,
        currentPositions: (await getPositions()).map(pos => pos.ticker),
        fitty: await getTickersBetween(0, 0.50),
        // upcoming: await getRhStocks('upcoming-earnings'),
        // rhtop100: await getRhStocks('100-most-popular'),
        // ...await getFinvizCollections(),
        // ...await getStockInvestCollections()
    };

    // remove any tickers that are not available on     const getTicks = () => Object.values(response).flatten().uniq();
    const getTicks = () => Object.values(response).flatten().uniq();
    const originalTickers = getTicks();
    
    // const withRisk = await mapLimit(originalTickers, 13, async ticker => {
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

    badTickers.push("BRK.B");
    badTickers.push("GOOGL");

    strlog({ badTickers });
    
    response = mapObject(
        response, 
        tickers => (tickers || []).filter(ticker => 
            !badTickers.includes(ticker)
        )
    );

    strlog(mapObject(response, v => v.length));
    console.log(`without bad stock count: ${getTicks().length}`);

    // FILTER FOR ONLY THE "GOOD STUFF"



    for (let key of ['rhtop100', 'fitty']) {
        console.log('filtering', key);
        response = {
            ...response,
            [key]: await filterForTheGood(response[key])
        };
    }

    strlog(mapObject(response, v => v.length));
    console.log(`only the good stuff: ${getTicks().length}`);

    return response;

};