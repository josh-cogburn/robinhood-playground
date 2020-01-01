const allPositionWatchers = {};
const PositionWatcher = require('./PositionWatcher');

module.exports = {
  create: data => {

    const { 
      ticker, 
      buyPrice,
    } = data;
    
    console.log('step 2 - new position watcher fo sho!')
    if (allPositionWatchers[ticker]) {
      allPositionWatchers[ticker].newBuy(buyPrice);
    } else {
      allPositionWatchers[ticker] = new PositionWatcher(data);
    }
  
  },

  delete: ticker => {
    if (!allPositionWatchers[ticker]) return;
    allPositionWatchers[ticker].stop();
    allPositionWatchers[ticker] = null;
  } 
}


// observe all right before close
const regCronIncAfterSixThirty = require('./reg-cron-after-630');
regCronIncAfterSixThirty({
  name: `final before close observe all position watchers`,
  run: [387],
  fn: async (min) => {
    for (let positionWatcher of Object.values(allPositionWatchers)) {
      await positionWatcher.observe(true);
    }
  }
});