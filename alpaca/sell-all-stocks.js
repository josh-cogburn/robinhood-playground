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
            setTimeout(() => {
                console.log('selling', pos.symbol);
                sellPosition({
                    ticker: pos.symbol,
                    quantity: pos.qty
                })
            }, 1000 * Math.random() * 360);
        } catch (e) {
            strlog(e)
        }
    }
};