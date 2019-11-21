const alpacaLimitBuy = require('../alpaca/limit-buy');
const Pick = require('../models/Pick');
const purchaseStocks = require('../app-actions/purchase-stocks');

module.exports = async () => {
  const dateStr = (new Date()).toLocaleDateString().split('/').join('-');
  const pickObj = {
    date: dateStr, 
    strategyName: 'testing-blah-blah',
    min: 5000,
    picks: [{
      ticker: 'ESTR',
      price: 0.23
    }],
    keys: {
      'blah-blah': true
    },
    data: {
      seriois: 'nah'
    },
    isRecommended: true
  };

  const PickDoc = await Pick.create(pickObj);

  strlog({
    PickDoc
  });


  await purchaseStocks({
      stocksToBuy: ['ESTR'],
      strategy: 'testing-blah-blah2',
      multiplier: 1,
      min: 5000,
      withPrices: [{
        ticker: 'ESTR',
        price: 0.23
      }],
      PickDoc
  });

};