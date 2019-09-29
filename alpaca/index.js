const { alpaca: alpacaConfig } = require('../config');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca(alpacaConfig);
const newAvgDowner = require('../utils/new-avg-downer');
const Holds = require('../models/Holds');

const client = alpaca.websocket
client.onConnect(function() {
  console.log("Connected")
  client.subscribe(['trade_updates', 'account_updates'])
})
client.onDisconnect(() => {
  console.log("Disconnected")
})
client.onStateChange(newState => {
  console.log(`State changed to ${newState}`)
})
client.onOrderUpdate(async data => {
  console.log(`Order updates: ${JSON.stringify(data)}`);
  const {
    event,
    order: {
      filled_avg_price,
      // filled_qty,
      side,
      symbol,
    }
  } = data;
  const isFill = event === 'fill';
  if (!isFill) {
    return console.log('not a fill');
  }

  if (side === 'buy') {
    newAvgDowner({
      ticker: symbol, 
      buyPrice: filled_avg_price 
    })
  } else {
    await Holds.deleteOne({
      ticker: symbol
    });
  }

})
client.onAccountUpdate(data => {
  console.log(`Account updates: ${JSON.stringify(data)}`)
})
client.onStockTrades(function(subject, data) {
  console.log(`Stock trades: ${subject}, ${data}`)
})
client.onStockQuotes(function(subject, data) {
  console.log(`Stock quotes: ${subject}, ${data}`)
})
client.onStockAggSec(function(subject, data) {
  console.log(`Stock agg sec: ${subject}, ${data}`)
})
client.onStockAggMin(function(subject, data) {
  console.log(`Stock agg min: ${subject}, ${data}`)
})
client.connect();

module.exports = {
    alpaca,
    client
};