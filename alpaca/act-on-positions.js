const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');
const Holds = require('../models/Holds');
const { mapObject, pick } = require('underscore');

const getPositions = require('./get-positions');
const sendEmail = require('../utils/send-email');

module.exports = async (_, dontAct) => {
    let positions = await getPositions();
    positions = positions.filter(({ ticker }) => !keep.includes(ticker));

    if (dontAct) {
        return strlog({ positions });
    }

    await Promise.all(
        selling.map(async position => {
            const { ticker, recommendation, daysOld } = position;
            if (recommendation === '---') {
                return console.log(`${ticker} says ${recommendation}.  doing nothing.`);
            } else if (['take profit', 'cut your losses'].some(val => recommendation === val)) {
                return sellPosition(position);
            } else if (recommendation === 'average down') {
                const realtimeRunner = require('../realtime/RealtimeRunner');
                await realtimeRunner.handlePick({
                  strategyName: 'average-down-recommendation',
                  ticker,
                  keys: {
                    daysOld
                  },
                  data: { 
                    position
                  }
                }, true);
            }
        })
    );
};