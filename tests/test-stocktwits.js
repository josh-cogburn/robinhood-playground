const stocktwits = require('../utils/stocktwits');
(async() => {
    console.log(
        await stocktwits.postBullish('BPMX', `I am feeling good about this`)
    )
})();