const getBaseCollections = require('./base-collections');
const deriveCollections = require('./derive-collections');
const { mapObject } = require('underscore');

module.exports = async dontMerge => {
  console.log('getting base collections....')
  const baseCollections = await getBaseCollections();
  console.log('getting derived collections....')
  const derivedCollections = await deriveCollections(baseCollections);
  const merged = {
    ...baseCollections,
    ...derivedCollections
  };
  // strlog(
  //   mapObject(
  //     merged,
  //     results => results.length
  //   )
  // );
  console.log('leaving collections index')
  return dontMerge ? {
    baseCollections,
    derivedCollections
  } : merged;
};
