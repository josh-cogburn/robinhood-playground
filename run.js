const login = require('./rh-actions/login');
const getTrendAndSave = require('./app-actions/get-trend-and-save');

// node run [filename goes here]

(async () => {
    console.log('asd')
    console.log(process.argv, 'ps');
    let Robinhood = await login();
    const argPath = process.argv[2];
    let relatedAnalysisFn = require(`./${argPath}`);

    let callArgs = [Robinhood];
    if (argPath.includes('modules/')) {
        relatedAnalysisFn = relatedAnalysisFn.trendFilter;
        const trend = await getTrendAndSave(Robinhood);

        console.log('got trend');
        // console.log(trend);
        callArgs.push(trend.filter(t => t.last_trade_price < 5));
    }


    const response = await relatedAnalysisFn(...callArgs, ...process.argv.slice(3));
    console.log('response');
    console.log(JSON.stringify(response, null, 2));
})();
