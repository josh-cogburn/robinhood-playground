const ClosedPosition = require('../../models/Holds/ClosedPositions');
const analyzePositions = require('./analyze-positions');

module.exports = async () => {
  let closed = await ClosedPosition.find({}).lean();
  closed = await analyzePositions(closed);
  return closed;
};