const { alpaca } = require('../../alpaca/');
const Hold = require('../../models/Holds');
const analyzePositions = require('./analyze-positions');

const analyzeOpen = async open => {
  
  const alpacaPositions = await alpaca.getPositions();
  console.log({ alpacaPositions })
  const withPositions = await mapLimit(open, 1, position => {
    return {
      ...position,
      position: alpacaPositions.find(pos => pos.symbol === position.ticker)
    }
  });
  strlog({
    'stale tickers': withPositions.filter(pos => !pos.position).map(pos => pos.ticker)
  })

  strlog({
    delete: await Hold.find({ 
      ticker: {
        $in: withPositions.filter(pos => !pos.position).map(pos => pos.ticker)
      }
    }).remove()
  })
  return withPositions
    // .filter(({ position }) => position)
    .map(position => {
      console.log(position);
      return position;
    })
    .map(position => {
      const { 
        market_value: marketValue, 
        unrealized_pl: unrealizedPl 
      } = position.position || {};
      delete position.position;
      return {
        ...position,
        marketValue,
        netImpact: Number(position.sellReturnDollars || 0) + Number(unrealizedPl),
        // isStale: !position.position
      };
    })
    .sort((a, b) => b.netImpact - a.netImpact);
};



module.exports = async () => {
  let open = await Hold.find({}).lean();
  open = await analyzePositions(open);
  open = await analyzeOpen(open);
  return open;
};