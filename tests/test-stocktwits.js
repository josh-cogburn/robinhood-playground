const stocktwits = require('../utils/stocktwits');
(async() => {
    console.log(
        await stocktwits.postBullish('AKER', `testing bullish in the group`)
    )
})();