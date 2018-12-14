const stocktwits = require('./utils/stocktwits');
(async() => {
    await stocktwits.postBearish('AKER', 'i said so');
})();