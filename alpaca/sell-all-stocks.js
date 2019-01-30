const { alpaca } = require('.');

module.exports = async () => {
    const positions = await alpaca.getPositions();
    for (let pos of positions) {
        const order = await alpaca.createOrder({
            symbol: pos.symbol, // any valid ticker symbol
            qty: Number(pos.qty),
            side: 'sell',
            type: 'market',
            time_in_force: 'day',
        });
        log(order)
    }
};