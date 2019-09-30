const { alpaca } = require('.');
const { force: { keep }} = require('../settings');
const sellPosition = require('./sell-position');

module.exports = async (_, dontSell) => {
    let positions = await alpaca.getPositions();
    positions = positions.filter(pos => !keep.includes(pos.symbol));
    log('selling' + positions.map(p => p.symbol));
    if (dontSell) return;
    for (let pos of positions) {
        try {
            await sellPosition({
                ticker: pos.symbol,
                quantity: pos.qty
            });
        } catch (e) {
            strlog(e)
        }
    }
};