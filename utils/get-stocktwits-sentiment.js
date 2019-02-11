const request = require('request-promise');
const { getProxy } = require('./stocktwits');
const { avgArray } = require('./array-math');
const cacheThis = require('./cache-this');

const stReq = cacheThis(
    async url => {
        console.log({ url })
        try {
            const res = await request({
                url,
                proxy: getProxy()
            });
            return JSON.parse(res);
        } catch (e) {
            console.error(JSON.parse(e.response.body).response.status);
            throw JSON.parse(e.response.body).response;
        } finally {
            await new Promise(resolve => setTimeout(resolve, 2600)); // rate limited
        }
        
    },
    10
);
    

module.exports = async (Robinhood, ticker, detailed) => {
    try {
        console.log({ ticker}, 'getting stocktwits sent')
        let { messages } = await stReq(`https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json?filter=top`);
        const last3DaysMessages = messages.filter(o => (Date.now() - new Date(o.created_at).getTime()) < 1000 * 60 * 60 * 24 * 3);
        const totalCount = last3DaysMessages.length;
        const getSentiment = s => last3DaysMessages.filter(o => o.entities.sentiment && o.entities.sentiment.basic === s).length;
        const bearishCount = getSentiment('Bearish')
        const bullishCount = getSentiment('Bullish');
        // console.log('got stocktwits sent', ticker, { totalCount, bearishCount, bullishCount });

        const bullishScore = (bullishCount / totalCount * 100) * 1.75;
        let bullBearScore = bullishScore - bearishCount * 2;
        bullBearScore = Math.round(bullBearScore * totalCount / 30);
    
        let detailedData = {};
        if (detailed && totalCount > 3) {
            const sentimentUrl = `https://api.stocktwits.com/api/2/symbols/${ticker}/sentiment.json`;
            const { data: sentimentData } = await stReq(sentimentUrl);
            const [{ bullish: mostRecentSentiment }] = sentimentData;
            const withSentiment = avgArray([bullBearScore, mostRecentSentiment]);
            detailedData = {
                mostRecentSentiment,
                withSentiment
            };
            
            const volumeUrl = `https://api.stocktwits.com/api/2/symbols/${ticker}/volume.json`;
            const { data: volumeData } = await stReq(volumeUrl);
            const [{ volume_change: todayVolumeChange }] = volumeData;
            const withSentAndVol = avgArray([
                ...new Array(6).fill(withSentiment),
                withSentiment * (1 + todayVolumeChange / 8)
            ]);
            detailedData = {
                ...detailedData,
                todayVolumeChange,
                withSentAndVol
            };
        }
        
        const returnObj = {
            bearishCount,
            bullishCount,
            bullBearScore,
            ...detailedData
        };
        console.log(ticker, returnObj);
        return returnObj;
    } catch (e) {
        // console.error(e);
        return null;
    }
    
};