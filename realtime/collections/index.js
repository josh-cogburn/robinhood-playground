const getBaseCollections = require('./base-collections');
const deriveCollections = require('./derive-collections');
const { mapObject } = require('underscore');

module.exports = async dontMerge => {
  const baseCollections = await getBaseCollections();
  const derivedCollections = await deriveCollections(baseCollections);
  const merged = {
    ...baseCollections,
    ...derivedCollections
  };
  strlog(
    mapObject(
      merged,
      results => results.length
    )
  );
  return dontMerge ? {
    baseCollections,
    derivedCollections
  } : merged;
};
