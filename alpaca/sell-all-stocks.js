const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');
const Holds = require('../models/Holds');

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
            wouldBeDayTrade
        }
    })

    log('selling' + positions.filter(p => !p.wouldBeDayTrade).map(p => p.symbol));
    if (dontSell) return;
    for (let pos of positions.filter(p => !p.wouldBeDayTrade)) {
        console.log(pos.symbol)
        try {
            
            // setTimeout(() => {
                console.log('selling', pos.symbol);
                sellPosition({
                    ticker: pos.symbol,
                    quantity: pos.qty
                })
            // }, 1000 * Math.random() * 650);
        } catch (e) {
            strlog(e)
        }
    }
};