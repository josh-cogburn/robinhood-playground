const getPositions = require('./get-positions');
const { continueDownForDays } = require('../settings');

module.exports = async () => {
  const positions = await getPositions();
  const ofInterest = positions.filter(({ daysOld }) => daysOld <= continueDownForDays);
  const belowPercent = ofInterest.filter(({ returnPerc }) => returnPerc < 0);
  const hasDecentMultipliers = belowPercent.filter(({ numMultipliers }) => numMultipliers > 3);
  for (let position of hasDecentMultipliers) {
    const { ticker, daysOld, outsideBracket } = position;
    require('../realtime/RealtimeRunner').handlePick({
      strategyName: 'continue-down',
      ticker,
      keys: {
        [`${daysOld}daysOld`]: true,
        outsideBracket,
        downAlot: returnPerc < -10
      },
      data: { 
        position
      }
    }, true);
  }
};