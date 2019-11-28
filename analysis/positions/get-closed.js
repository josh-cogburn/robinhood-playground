const ClosedPosition = require('../../models/Holds/ClosedPositions');
const analyzePosition = require('./analyze-position');

module.exports = async () => {
  let closed = await ClosedPosition.find({}).lean();
  closed = await mapLimit(closed, 1, analyzePosition);
  return closed;
};