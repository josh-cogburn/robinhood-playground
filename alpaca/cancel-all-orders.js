module.exports = async ticker => {
    const { alpaca } = require('.');
    const orders = await alpaca.getOrders({
        status: 'open'
    });
    str({ orders })
    for (let order of orders) {
        if (ticker === undefined || ticker === order.symbol) {
            log(await alpaca.cancelOrder(order.id));
        }
    }
};
