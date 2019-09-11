const alpacaLimitBuy = require('../alpaca/limit-buy');

module.exports = async () => {

  const response = await alpacaLimitBuy(
    null,
    'BPMX',
    1,
    .49,
  );

  console.log({ response })

};