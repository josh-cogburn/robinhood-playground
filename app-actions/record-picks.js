// const fs = require('mz/fs');
// const jsonMgr = require('../utils/json-mgr');
// const lookup = require('../utils/lookup');
// const mapLimit = require('promise-map-limit');
const lookupMultiple = require('../utils/lookup-multiple');
const stratManager = require('../socket-server/strat-manager');
const Pick = require('../models/Pick');
const stratOfInterest = require('../utils/strat-of-interest');

// const purchaseStocks = require('./purchase-stocks');
const sendEmail = require('../utils/send-email');
const tweeter = require('./tweeter');
const calcEmailsFromStrategy = require('../utils/calc-emails-from-strategy');
const stocktwits = require('../utils/stocktwits');
const { disableMultipliers } = require('../settings');
const pmsHit = require('../utils/pms-hit');
const { emails } = require('../config');

const saveToFile = async (strategy, min, withPrices, { keys, data }) => {

    const stratMin = `${strategy}-${min}`;
    const hits = await pmsHit(null, stratMin);

    if (!stratOfInterest(stratMin, withPrices.length)) return;   // cant handle too many strategies apparently
    if (!strategy.includes('cheapest-picks')) withPrices = withPrices.slice(0, 3);  // take only 3 picks

    withPrices = withPrices.filter(tickerPrice => !!tickerPrice);
    if (!withPrices.length) {
        return console.log(`no stocks found for ${stratMin}`)
    }

    // console.log('recording', stratMin, 'strategy');
    const dateStr = stratManager.curDate;
    // const dateStr = (new Date()).toLocaleDateString().split('/').join('-');

    // save to mongo
    console.log(`saving ${strategy} to mongo`);
                
    const mongoResponse = await Pick.create({
        date: dateStr, 
        strategyName: strategy,
        min,
        picks: withPrices,
        keys,
        data,
    });

    // strlog(mongoResponse);

    // for socket-server
    stratManager.newPick({
        _id: mongoResponse._id,
        stratMin,
        withPrices,
        timestamp: mongoResponse.timestamp,
        keys,
        ...hits.includes('forPurchase') && { forPurchasePick: true }
    });


    
    // forPurchase
    if (hits.includes('forPurchase')) {
        console.log('strategy enabled: ', stratMin, 'purchasing');
        // const stocksToBuy = withPrices.map(obj => obj.ticker);
        // await purchaseStocks({
        //     stocksToBuy,
        //     strategy,
        //     multiplier: !disableMultipliers ? forPurchaseMultiplier : 1,
        //     min,
        //     withPrices
        // });
        // if (withPrices.length === 1) {
        //     const [{ ticker }] = withPrices;
        //     await stocktwits.postBullish(ticker, stratMin);
        // }
        // tweeter.tweet(`BUY ${withPrices.map(({ ticker, price }) => `#${ticker} @ $${price}`).join(' and ')} - ${stratMin}`);
    }

    // for email
    const emailsToSend = Object.keys(emails)
        .reduce((acc, email) => {
            const pms = emails[email];
            const toSend = pms.filter(pm => 
                hits.includes(pm)
            );
            return [
                ...acc,
                ...toSend.map(pm => ({
                    pm,
                    email
                }))
            ]
        }, []);
    for (let { email, pm } of emailsToSend) {
        await sendEmail(
            `robinhood-playground${pm ? `-${pm}` : ''}: ${stratMin}`,
            JSON.stringify(withPrices, null, 2),
            email
        );
    }


    return mongoResponse._id;

};





module.exports = async (strategy, min, toPurchase, trendKey = '', { keys, data }) => {

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
        return saveToFile(strategyName, min, withPrices, { keys, data });
    };

    if (!Array.isArray(toPurchase)) {
        // its an object
        const allTickers = [...new Set(
            Object.keys(toPurchase)
                .map(strategyName => toPurchase[strategyName])
                .reduce((acc, val) => acc.concat(val), []) // flatten
        )];
        // console.log('alltickers', allTickers);
        const tickerLookups = await lookupMultiple(allTickers, true);
        // console.log('tickerLookups', tickerLookups);
        for (let strategyName of Object.keys(toPurchase)) {
            const subsetToPurchase = toPurchase[strategyName];
            const stratName = [
                strategy,
                trendKey,
                strategyName
            ].filter(Boolean).join('-');
            await record(subsetToPurchase, stratName, tickerLookups);
        }
    } else {
        console.log('no variety to purchase');
        const tickerLookups = await lookupMultiple(toPurchase, true);
        const stratName = [strategy, trendKey].filter(Boolean).join('-');
        return record(toPurchase, stratName, tickerLookups);
    }

};
