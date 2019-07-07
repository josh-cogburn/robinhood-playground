const { sortBy } = require('underscore');
const getMinutesFrom630 = require('../../utils/get-minutes-from-630');

module.exports = {
  postRun: (newPicks, todaysPicks) => {
    const allPicks = [
      ...todaysPicks,
      newPicks
    ].slice(-6).flatten()
    .filter(pick => pick.strategyName !== 'most-picked');
    const allTickers = allPicks.map(pick => pick.ticker).uniq();
    const withCount = allTickers.map(ticker => ({
      ticker,
      matches: allPicks.filter(pick => pick.ticker === ticker)
    }));
    const sorted = sortBy(withCount, ({ matches }) => matches.length).reverse();
    // strlog({ sorted });
    const min = getMinutesFrom630();
    return sorted.slice(0, 1).map(({ ticker, matches }) => ({
      ticker,
      keys: {
        [`min${min}`]: true
      },
      data: {
        matches,
        min
      }
    }));
  }
}