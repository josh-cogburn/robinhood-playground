const getPositions = require('./get-positions');
const { continueDownForDays } = require('../settings');

module.exports = async () => {
  const positions = await getPositions();
  const ofInterest = positions.filter(({ daysOld }) => daysOld <= continueDownForDays);
  const belowPercent = ofInterest.filter(({ returnPerc }) => returnPerc < -2);
  for (let position of belowPercent) {
    const { daysOld, outsideBracket } = position;
    require('../realtime/RealtimeRunner').handlePick({
      strategyName: 'continue-down',
      ticker,
      keys: {
        [`${daysOld}daysOld`]: true,
        outsideBracket
      },
      data: { 
        position
      }
    }, true);
  }
};