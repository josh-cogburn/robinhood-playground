import getSubsets from './get-subsets';
const { groupBy, mapObject } = require('underscore');
const analyzeGroup = require('./analyze-group');
Array.prototype.uniq = function() {
  return [...new Set(this)];
};

export default positions => {
  const subsets = getSubsets(positions);
  const overall = mapObject(subsets, (subsetFn = () => true, subsetName) => {
    const withoutASLN = positions.filter(({ ticker }) => ticker !== 'ASLN');
    return analyzeGroup(
      withoutASLN.filter(pos => {
        try {
          return subsetFn(pos);
        } catch (e) {
          return false;
        }
      })
    );
  }
    
  );

  return overall;
};