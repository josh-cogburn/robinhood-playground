module.exports = {

  postRun: picks => {

    const uniqTickers = picks.map(pick => pick.ticker).uniq();
    const tickersToStratHits = uniqTickers.reduce((acc, ticker) => ({
      ...acc,
      [ticker]: picks
        .filter(pick => pick.ticker === ticker)
        .map(pick => pick.strategyName)
        .uniq()
    }), {});

    const multiHitTickers = Object.keys(tickersToStratHits).filter(ticker => 
      tickersToStratHits[ticker].length > 1
    );
    
    return multiHitTickers.map(ticker => {
      const uniqStrats = tickersToStratHits[ticker];
      return {
        ticker,
        keys: {
          [`${uniqStrats.length}count`]: true,
        },
        data: {
          uniqStrats
        }
      };
    });

  }
}