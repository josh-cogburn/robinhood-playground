const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');
const Holds = require('../models/Holds');
const { mapObject, pick } = require('underscore');

const getPositions = require('./get-positions');
const alpacaMarketSell = require('./market-sell');
const sendEmail = require('../utils/send-email');
const stratManager = require('../socket-server/strat-manager');

module.exports = async (_, dontAct, sellAllStocks = false) => {
    let positions = await getPositions();
    positions = positions.filter(({ ticker }) => !keep.includes(ticker));

    if (dontAct) {
        return strlog({ positions });
    }

    if (sellAllStocks) {
        await stratManager.init({ lowKey: true });
        return Promise.all(
            positions
                .filter(({ wouldBeDayTrade }) =>!wouldBeDayTrade)
                .map(({ ticker, quantity }) => 
                    alpacaMarketSell({
                        ticker,
                        quantity
                    }, 100)
                )
        )
    }

    await Promise.all(
        positions
            .filter(({ wouldBeDayTrade }) =>!wouldBeDayTrade)
            .map(async position => {
                const { ticker, recommendation, daysOld, stBracket, wouldBeDayTrade } = position;

                // if (recommendation === 'average down') {
                //     const realtimeRunner = require('../realtime/RealtimeRunner');
                //     await realtimeRunner.handlePick({
                //       strategyName: 'average-down-recommendation',
                //       ticker,
                //       keys: {
                //         [`${daysOld}daysOld`]: true,
                //         [stBracket]: true,
                //       },
                //       data: { 
                //         position
                //       }
                //     }, true);
                // }

                if (wouldBeDayTrade) return;
                return sellPosition(position);
                
                
            })
    );
};