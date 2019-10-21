const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');
const Holds = require('../models/Holds');
const { mapObject, pick } = require('underscore');

const getPositions = require('./get-positions');
const sendEmail = require('../utils/send-email');

module.exports = async (_, dontSell) => {
    let positions = await getPositions();
    positions = positions.filter(({ ticker }) => !keep.includes(ticker));

    const selling = positions.filter(
        ({ shouldSell, wouldBeDayTrade}) => 
            shouldSell && !wouldBeDayTrade
    );

    log('selling', selling.map(pos => pos.ticker));
    if (dontSell) return;

    await Promise.all(selling.map(sellPosition));
};