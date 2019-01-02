const login = require('./rh-actions/login');
const getTrendAndSave = require('./app-actions/get-trend-and-save');

const mongoose = require('mongoose');
const { mongoConnectionString } = require('./config');

const Pick = require('./models/Pick');

mongoose.connect(mongoConnectionString, { useNewUrlParser: true });


// node run [filename goes here]

(async () => {
    console.log('asd')
    console.log(process.argv, 'ps');
    let Robinhood = await login();
    global.Robinhood = Robinhood;
    const argPath = process.argv[2];
    let relatedFile = require(`./${argPath}`);

    let callArgs = [Robinhood];
    if (argPath.includes('modules/')) {
        const { trendFilter } = relatedFile;
        if (trendFilter) {
            const trend = await getTrendAndSave(Robinhood);
            console.log('got trend');
            console.log(trend);
            callArgs.push(trend.filter(t => t.last_trade_price < 5));
        } else {
            callArgs.push(25); // min
        }
    }

    const restArgs = process.argv.slice(3)
        .map(arg => arg === 'true' ? true : arg)
        .map(arg => arg === 'false' ? false : arg);

    const fnToRun = relatedFile.trendFilter || relatedFile.fn || relatedFile.init || relatedFile.default || relatedFile;
    const response = await fnToRun(...callArgs, ...restArgs);
    console.log('response');
    console.log(JSON.stringify(response, null, 2));

    mongoose.connection.close();
})();
