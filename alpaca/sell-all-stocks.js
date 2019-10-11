const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');
const Holds = require('../models/Holds');
const { mapObject, pick } = require('underscore');
const sendEmail = require('../utils/send-email');

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
        // && (
        //     p.percChange > 4.3 || 
        //     p.percChange < -4.6
        // )
    );

    log('selling',positions);
    if (dontSell) return;

    await Promise.all(
        positions.map(async pos => {
            if (Number(pos.market_value) > 100) {
                await sendEmail('', `you should sell ${pos.symbol}`, '5' + 102940361 + '@v' + 'text.com');
            } else {
                await sellPosition(pos)
            }
        })
    );
};