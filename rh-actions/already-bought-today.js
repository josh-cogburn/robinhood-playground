const loadAllTransactionsSince = require('./load-all-transactions-since');

module.exports = async (Robinhood, ticker) => {
    
    const transactions = await loadAllTransactionsSince(Robinhood, 1);
    // console.log(JSON.stringify(transactions, null, 2));
    return transactions.some(t => {
        return t.side === 'buy' && t.instrument.symbol === ticker;
    });
    
}