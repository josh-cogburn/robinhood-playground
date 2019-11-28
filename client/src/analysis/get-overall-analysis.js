import getSubsets from './get-subsets';
const { groupBy, mapObject } = require('underscore');
const analyzeGroup = require('./analyze-group');
Array.prototype.uniq = function() {
  return [...new Set(this)];
};

export default positions => {
  const overall = mapObject(getSubsets(positions), (filterFn = () => true) => 
    analyzeGroup(
      positions.filter(pos => {
        try {
          return filterFn(pos);
        } catch (e) {
          return false;
        }
      })
    )
  );

  return overall;
};