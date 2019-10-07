const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');
const Holds = require('../models/Holds');
const { mapObject, pick } = require('underscore');

module.exports = async (_, dontSell) => {
    let positions = await alpaca.getPositions();
    positions = positions.filter(pos => !keep.includes(pos.symbol));

    positions = await mapLimit(positions, 1, async pos => {
        const foundHold = await Holds.findOne({ ticker: pos.symbol });
        const wouldBeDayTrade = Boolean(foundHold && foundHold.buys && foundHold.buys.some(buy => 
            buy.date === (new Date()).toLocaleDateString().split('/').join('-')
        ));
        strlog({ 
            ticker: pos.symbol, 
            wouldBeDayTrade, 
            foundHold 
        });
        return {
            ...pos,
            wouldBeDayTrade,
            percChange: pos.unrealized_plpc * 100
        };
    });

    strlog(positions.map(pos => pick(pos, ['symbol', 'wouldBeDayTrade', 'percChange'])));

    positions = positions.filter(p => 
        !p.wouldBeDayTrade
        && (
            p.percChange > 6.3 || 
            p.percChange < -3.6
        )
    );

    log('selling' + positions.map(p => p.symbol));
    if (dontSell) return;
    for (let pos of positions) {
        console.log(pos.symbol)
        try {
            setTimeout(() => {
                console.log('selling', pos.symbol);
                sellPosition(position)
            }, 1000 * Math.random() * 650);
        } catch (e) {
            strlog(e)
        }
    }
};