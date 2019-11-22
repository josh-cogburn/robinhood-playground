// const fs = require('mz/fs');
// const jsonMgr = require('../utils/json-mgr');
// const lookup = require('../utils/lookup');
// const mapLimit = require('promise-map-limit');
const getAdditionalMultipliers = require('./get-additional-multipliers');
const lookupMultiple = require('../utils/lookup-multiple');
const stratManager = require('../socket-server/strat-manager');
const Pick = require('../models/Pick');

const purchaseStocks = require('./purchase-stocks');
const sendEmail = require('../utils/send-email');
const tweeter = require('./tweeter');
const calcEmailsFromStrategy = require('../utils/calc-emails-from-strategy');
const stocktwits = require('../utils/stocktwits');
const { disableMultipliers, forPurchase } = require('../settings');
const pmsHit = require('../utils/pms-hit');
const { emails } = require('../config');


const { throttle } = require('underscore')
const throttledRefreshPositions = throttle(() => {
  console.log('sending refresh positions to strat manager')
  require('../socket-server/strat-manager').refreshPositions()
}, 10000);



const saveToFile = async (strategy, min, withPrices, { keys, data }) => {

    const stratMin = `${strategy}-${min}`;
    const hits = await pmsHit(null, stratMin);
    const isRecommended = hits.includes('forPurchase'); // because forPurchase === isRecommended now!

    let forPurchasePms = isRecommended 
        ? forPurchase
            .filter(line => line.startsWith('['))
            .map(line => line.substring(1, line.length - 1))
            .filter(pm => hits.includes(pm)) 
        : [];

    const forPurchaseMultiplier = isRecommended ? Math.max(
        1,
        forPurchasePms.length
    ) : null;

    forPurchasePms = forPurchasePms.uniq();

    const additionalMultipliers = await getAdditionalMultipliers(forPurchasePms);
    const actualAddThis = Math.min(8, forPurchaseMultiplier * (additionalMultipliers / 3));
    const multiplier = forPurchaseMultiplier + actualAddThis;

    console.log({ 
        forPurchasePms, 
        multiplier, 
        forPurchaseMultiplier, 
        additionalMultipliers, 
        actualAddThis 
    });


    withPrices = withPrices.filter(tickerPrice => !!tickerPrice);
    if (!withPrices.length) {
        return console.log(`no stocks found for ${stratMin}`)
    }

    // console.log('recording', stratMin, 'strategy');
    const dateStr = stratManager.curDate;
    // const dateStr = (new Date()).toLocaleDateString().split('/').join('-');

    // save to mongo
    console.log(`saving ${strategy} to mongo`);

    const pickObj = {
        date: dateStr, 
        strategyName: strategy,
        min,
        picks: withPrices,
        keys,
        data,
        isRecommended,
        ...isRecommended && {

            pmsHit: forPurchasePms,

            multiplier,
            forPurchaseMultiplier,
            additionalMultipliers,
            actualAddThis

        }
    };

    const PickDoc = await Pick.create(pickObj);

    // strlog(PickDoc);

    // for sockets
    stratManager.newPick({
        ...pickObj,
        _id: PickDoc._id,
        stratMin,
        withPrices,
        timestamp: PickDoc.timestamp,
        keys,
    });

    var stocksToBuy = withPrices.map(t => t.ticker);
    await Promise.all([
        (async () => {

            // forPurchase
            if (isRecommended) {
                console.log('strategy enabled: ', stratMin, 'purchasing');
                
                await purchaseStocks({
                    strategy,
                    multiplier: !disableMultipliers ? Math.min(multiplier, 2.5): 1,
                    min,
                    withPrices,
                    PickDoc
                });
                throttledRefreshPositions();
                // if (withPrices.length === 1) {
                //     const [{ ticker }] = withPrices;
                //     await stocktwits.postBullish(ticker, stratMin);
                // }
                // tweeter.tweet(`BUY ${withPrices.map(({ ticker, price }) => `#${ticker} @ $${price}`).join(' and ')} - ${stratMin}`);
            }

        })(),
        (async () => {

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
                    stocksToBuy.join(', '),
                    email
                );
            }

        })()
    ])



    return PickDoc._id;

};





module.exports = async (strategy, min, toPurchase, trendKey = '', { keys, data } = {}) => {
    const isNotRegularHours = min < 0 || min > 390;

    const record = async (stocks, strategyName, tickerLookups) => {
        
        const withPrices = stocks.map(ticker => {
            console.log('recording', {
                ticker
            })
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
        console.log('obj', toPurchase)
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
        console.log('array', toPurchase)
        console.log('no variety to purchase', );
        const tickerLookups = await lookupMultiple(toPurchase, true);
        const stratName = [strategy, trendKey].filter(Boolean).join('-');
        return record(toPurchase, stratName, tickerLookups);
    }

};
