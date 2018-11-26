const fs = require('mz/fs');
const jsonMgr = require('../utils/json-mgr');
const lookup = require('../utils/lookup');
const mapLimit = require('promise-map-limit');
const { lookupTickers } = require('./record-strat-perfs');
const stratManager = require('../socket-server/strat-manager');
const Pick = require('../models/Pick');
const stratsOfInterest = require('../strats-of-interest');

const purchaseStocks = require('./purchase-stocks');
const sendEmail = require('../utils/send-email');
const tweeter = require('./tweeter');
const calcEmailsFromStrategy = require('../utils/calc-emails-from-strategy');

const saveToFile = async (Robinhood, strategy, min, withPrices) => {


    const stratMin = `${strategy}-${min}`;

    if (!stratsOfInterest.includes(stratMin)) return;   // cant handle too many strategies apparently

    if (!strategy.includes('cheapest-picks')) withPrices = withPrices.slice(0, 50);  // take only 50 picks

    withPrices = withPrices.filter(tickerPrice => !!tickerPrice);
    if (!withPrices.length) {
        return console.log(`no stocks found for ${stratMin}`)
    }

    console.log('recording', stratMin, 'strategy');

    const dateStr = (new Date()).toLocaleDateString().split('/').join('-');
    // const fileLocation = `./json/picks-data/${dateStr}/${strategy}.json`;
    // create day directory if needed
    // if (!(await fs.exists(`./json/picks-data/${dateStr}`))) {
    //     await fs.mkdir(`./json/picks-data/${dateStr}`);
    // }

    // console.log('getting prices', picks);
    // let withPrices = await mapLimit(picks, 1, async ticker => {
    //     try {
    //         return {
    //             ticker,
    //             price: (await lookup(Robinhood, ticker)).currentPrice
    //         };
    //     } catch (e) {
    //         return null;
    //     }
    // });

    // save to mongo
    console.log(`saving ${strategy} to mongo`);
    await Pick.create({
        date: dateStr, 
        strategyName: strategy,
        min,
        picks: withPrices
    });

    // save to /json

    // console.log('saving', strategy, 'picks', withPrices);
    // const curData = await jsonMgr.get(fileLocation);
    // const savedData = {
    //     ...curData,
    //     [min]: withPrices
    // };
    // await jsonMgr.save(fileLocation, savedData);

    // for socket-server
    stratManager.newPick({
        stratMin,
        withPrices
    });

    // for email$
    const emailsToSend = await calcEmailsFromStrategy(null, stratMin);
    console.log({ emailsToSend });
    for (let { email, pm } of emailsToSend) {
        await sendEmail(
            `robinhood-playground${pm ? `-${pm}` : ''}: ${stratMin}`,
            JSON.stringify(withPrices, null, 2),
            email
        );
    }

    // for purchase
    const strategiesEnabled = stratManager.strategies ? stratManager.strategies.forPurchase : [];
    const enableCount = strategiesEnabled.filter(strat => strat === stratMin).length;
    if (enableCount) {
        console.log('strategy enabled: ', stratMin, 'purchasing');
        const stocksToBuy = withPrices.map(obj => obj.ticker);
        await purchaseStocks(Robinhood, {
            stocksToBuy,
            strategy,
            multiplier: enableCount,
            min
        });
        tweeter.tweet(`BUY ${withPrices.map(({ ticker, price }) => `#${ticker} @ $${price}`).join(' and ')} - ${stratMin}`);
    }

};





module.exports = async (Robinhood, strategy, min, toPurchase, priceFilterSuffix = '') => {

    const isNotRegularHours = min < 0 || min > 390;

    const record = async (stocks, strategyName, tickerLookups) => {
        const withPrices = stocks.map(ticker => {
            const relatedLookup = tickerLookups[ticker];
            const price = isNotRegularHours ? 
                relatedLookup.afterHoursPrice || relatedLookup.lastTradePrice: 
                relatedLookup.lastTradePrice;
            return {
                ticker,
                price
            };
        });
        await saveToFile(Robinhood, strategyName, min, withPrices);
    };

    if (!Array.isArray(toPurchase)) {
        // its an object
        const allTickers = [...new Set(
            Object.keys(toPurchase)
                .map(strategyName => toPurchase[strategyName])
                .reduce((acc, val) => acc.concat(val), []) // flatten
        )];
        // console.log('alltickers', allTickers);
        const tickerLookups = await lookupTickers(Robinhood, allTickers, true);
        // console.log('tickerLookups', tickerLookups);
        for (let strategyName of Object.keys(toPurchase)) {
            const subsetToPurchase = toPurchase[strategyName];
            await record(subsetToPurchase, `${strategy}-${strategyName}${priceFilterSuffix}`, tickerLookups);
        }
    } else {
        console.log('no variety to purchase', toPurchase);
        const tickerLookups = await lookupTickers(Robinhood, toPurchase, true);
        console.log('ticker lookups', tickerLookups);
        await record(toPurchase, `${strategy}${priceFilterSuffix}`, tickerLookups);
    }

};
