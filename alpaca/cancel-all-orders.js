const { alpaca } = require('.');

module.exports = async () => {
    const orders = await alpaca.getOrders({
        status: 'open'
    });
    str({ orders })
    for (let order of orders) {
        alpaca.cancelOrder(order.id);
    }
};
