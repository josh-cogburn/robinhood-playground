const { alpaca: alpacaConfig } = require('../config');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const alpaca = new Alpaca(alpacaConfig);
const newAvgDowner = require('../utils/new-avg-downer');
const Holds = require('../models/Holds');
const getTrend = require('../utils/get-trend');

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
      filled_qty,
      qty,
      side,
      symbol,
    }
  } = data;
  const ticker = symbol;
  const isFill = event === 'fill';
  if (!isFill) {
    return console.log('not a fill');
  }

  if (side === 'buy') {
    newAvgDowner({
      ticker, 
      buyPrice: filled_avg_price 
    });

    await Holds.registerAlpacaFill({
      ticker,
      alpacaOrder,
    });
    
  } else if (side === 'sell') {
    
    const stratManager = require('../socket-server/strat-manager');
    const position = stratManager.positions.alpaca.find(pos => pos.ticker === ticker) || {};
    const {
        average_buy_price: buyPrice,
        buyStrategies
    } = position;
    const deletedHold = await Holds.findOneAndDelete({ ticker });
    const sellPrice = filled_avg_price;
    const returnDollars = (sellPrice - buyPrice) * qty;
    const returnPerc = getTrend(sellPrice, buyPrice);
    await sendEmail(
        `wow sold ${ticker} return... ${returnDollars} (${returnPerc}%)`, 
        JSON.stringify({
            ticker,
            buyPrice,
            sellPrice,
            qty,
            buyStrategies,
            orderFill: data,
            deletedHold,
            position
        }, null, 2)
    );
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