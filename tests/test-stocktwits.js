const stocktwits = require('../utils/stocktwits');
const { stocktwits: config, proxy: proxyConfig } = require('../config');
const request = require('request-promise');

const stReq = async (url, host) => {
    const res = await request({
        url,
        proxy: stocktwits.getProxy()
    });
    return JSON.parse(res);
};
    


(async() => {

    console.log();
    for (let host of proxyConfig.hosts) {
        const sentimentUrl = `https://api.stocktwits.com/api/2/symbols/AAPL/sentiment.json`;
        console.log({host});
        console.log(await stReq(sentimentUrl, host));
    }

    // console.log(
    //     await stocktwits.postBullish('AKER', `testing bullish in the group`)
    // )
})();