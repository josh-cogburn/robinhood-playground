const stocktwits = require('./utils/stocktwits');
(async() => {
    console.log(
        await stocktwits.postBearish('AKER', `i said so #${Math.random()}`)
    )
})();