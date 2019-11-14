const getFinvizCollections = require('./get-finviz-collections');
const getStockInvestCollections = require('./get-stockinvest-collections');
const getRisk = require('../../rh-actions/get-risk');
const addFundamentals = require('../../app-actions/add-fundamentals');
const runScan = require('../../scans/base/run-scan');
const hotSt = require('../../scans/hot-st');
// const droppers = require('../../scans/droppers');

const allStocks = require('../../json/stock-data/allStocks');
const lookupMultiple = require('../../utils/lookup-multiple');
const { isTradeable } = require('../../utils/filter-by-tradeable');
const { mapObject } = require('underscore');

const { alpaca } = require('../../alpaca');

let holds = [];

const OPTIONSTICKERS = [

    'SPY',  // NOPE!


    'GDX',
    'QQQ',
    'GLD',
    // 'VXX',

    'ROKU',
    'AMD',
    'SQ',
    'AAPL',
    // 'NFLX',
    'AMZN',
    'GOLD',
    'SBUX',
    'BAC',


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

    // const getTickersBetween = async (min, max) => {
    //     const tickPrices = await lookupMultiple(allStocks.filter(isTradeable).map(o => o.symbol));
    //     const tickers = Object.keys(tickPrices).filter(ticker => tickPrices[ticker] < max && tickPrices[ticker] > min);
    //     // console.log({ kstTickers: tickers });
    //     return tickers;
    // };

    // const getRhStocks = async rhTag => {
    //     console.log(`getting robinhood ${rhTag} stocks`);
    //     const {
    //         instruments: top100RHinstruments
    //     } = await Robinhood.url(`https://api.robinhood.com/midlands/tags/tag/${rhTag}/`);
    //     let top100RHtrend = await mapLimit(top100RHinstruments, 3, async instrumentUrl => {
    //         const instrumentObj = await Robinhood.url(instrumentUrl);
    //         return {
    //             ...instrumentObj,
    //             instrumentUrl,
    //             ticker: instrumentObj.symbol
    //         };
    //     });
    //     return top100RHtrend.map(t => t.ticker);
    // };

    holds = [
        ...holds,
        ...(await alpaca.getPositions()).map(pos => pos.symbol)
    ].uniq();
    
    let collections = {
        holds
        // spy: ['SPY'],
        // options: OPTIONSTICKERS,
    };

    const scans = {
        fitty: {
            minPrice: 0.20,
            maxPrice: 0.60,
            count: 60,
            minVolume: 300000
        },

        lowVolFitty: {
            minPrice: 0,
            maxPrice: 0.60,
            count: 33,
            maxVolume: 300000
        },

        zeroToOne: {
            minPrice: 0,
            maxPrice: 1,
            count: 300,
            minVolume: 200000
        },

        oneToTwo: {
            minPrice: 1,
            maxPrice: 2,
            minVolume: 70000
        },

        twoToFive: {
            minPrice: 2,
            maxPrice: 5,
            count: 300,
            minVolume: 200000
        },

        fiveToTen: {
            minPrice: 5,
            maxPrice: 10,
            count: 300,
            minVolume: 150000
        },

    };

    const getTicks = () => Object.values(collections).flatten().uniq();


    // collections['droppers'] = (await droppers({
    //     minPrice: 0.1,
    //     maxPrice: 8,
    //     count: 25,
    //     includeStSent: false,
    //     excludeTickers: getTicks(),
    //     afterHoursReset: false
    // })).map(t => t.ticker);;

    collections['hotSt'] = (await hotSt({
        minPrice: 0.1,
        maxPrice: 5,
        count: 25,
        includeStSent: false,
        excludeTickers: getTicks(),
        afterHoursReset: false
    })).map(t => t.ticker);
    
    for (let scanName of Object.keys(scans)) {
        const scan = scans[scanName];
        const response = (await runScan({
            ...scan,
            minVolume: 60000,
            includeStSent: false,
            excludeTickers: getTicks(),
            // minDailyRSI: 45
        })).map(t => t.ticker);
        collections[scanName] = response;
    };


        // lowVolumeTrash: (await runScan({
        //     minPrice: 1,
        //     maxPrice: 10,
        //     count: 120,
        //     includeStSent: false,
        //     minVolume: 20000,
        //     maxVolume: 90000,
        // })).map(t => t.ticker),
        
        // upcoming: await getRhStocks('upcoming-earnings'),
        // rhtop100: await getRhStocks('100-most-popular'),
        // ...await getFinvizCollections(),
        // ...await getStockInvestCollections()
    // };

    // remove any tickers that are not available on     const getTicks = () => Object.values(response).flatten().uniq();
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
    
    collections = mapObject(
        collections, 
        tickers => (tickers || []).filter(ticker => 
            !badTickers.includes(ticker)
        )
    );

    strlog(mapObject(collections, v => v.length));
    console.log(`without bad stock count: ${getTicks().length}`);

    // FILTER FOR ONLY THE "GOOD STUFF"



    // for (let key of ['fitty']) {
    //     console.log('filtering', key);
    //     collections = {
    //         ...collections,
    //         [key]: await filterForTheGood(collections[key])
    //     };
    // }

    strlog(mapObject(collections, v => v.length));
    console.log(`only the good stuff: ${getTicks().length}`);

    return collections;

};