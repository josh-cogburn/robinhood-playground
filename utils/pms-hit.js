const stratManager = require('../socket-server/strat-manager');
const { emails } = require('../config');
const { partition } = require('underscore');
const settings = require('../settings');

module.exports = async (_, strategy) => {
  await require('../realtime/RealtimeRunner').init();
  const pms = require('../realtime/RealtimeRunner').getPms();
  // console.log({ strategy, pms, emails });

  const matchesPm = pm => {
    // console.log({ pm })
    const match = pm => pms[pm] && pms[pm].every(part => strategy.includes(`${part}-`));

    if (pm === 'forPurchase') {
      let [forPurchasePms, forPurchaseStrats] = partition(
          settings.forPurchase, 
          line => (line.startsWith('[') && line.endsWith(']'))
      );

      forPurchasePms = forPurchasePms.map(line => line.substring(1, line.length - 1));
        // console.log({ forPurchasePms })
      return forPurchaseStrats.includes(strategy) ||
          forPurchasePms.some(pm => 
            match(pm)
          );
    } else {
      return match(pm);
    }
  };

  const hits = [
    ...Object.keys(pms),
    'forPurchase'
  ].filter(matchesPm);
  console.log({ hits })
  return hits;
  
};