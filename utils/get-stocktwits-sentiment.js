const request = require('request-promise');
const { getProxy } = require('./stocktwits');
const { avgArray } = require('./array-math');

const stReq = async url => {
    const res = await request({
        url,
        proxy: getProxy()
    });
    await new Promise(resolve => setTimeout(resolve, 150)); // rate limited
    return JSON.parse(res);
};
    

module.exports = async (Robinhood, ticker, detailed) => {
    try {
        let { messages } = await stReq(`https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json?filter=top`);
        const last3DaysMessages = messages.filter(o => (Date.now() - new Date(o.created_at).getTime()) < 1000 * 60 * 60 * 24 * 3);
        const totalCount = last3DaysMessages.length;
        const getSentiment = s => last3DaysMessages.filter(o => o.entities.sentiment && o.entities.sentiment.basic === s).length;
        const bearishCount = getSentiment('Bearish')
        const bullishCount = getSentiment('Bullish');
        // console.log(ticker, { totalCount, bearishCount, bullishCount });
        const bullBearScore = bullishCount / (bearishCount || 1) / bullishCount * 100 - bearishCount * 2 - (30 - bullishCount) || 0;
    
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
        console.error(e);
        return null;
    }
    
};