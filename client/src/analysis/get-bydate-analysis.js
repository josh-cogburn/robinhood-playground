const { groupBy, mapObject } = require('underscore');
const analyzeGroup = require('./analyze-group');

module.exports = positions => {
  const byDate = groupBy(positions.filter(position => position.date), 'date');
  const byDateAnalysis = Object.keys(byDate).map(date => {
    const datePositions = byDate[date];
    return {
      date,
      ...analyzeGroup(datePositions)
    };
  });
  return byDateAnalysis.reverse();
};