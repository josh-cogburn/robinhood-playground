const request = require('request-promise');
const { getProxy } = require('./stocktwits');
const { avgArray } = require('./array-math');
const cacheThis = require('./cache-this');
const Pick = require('../models/Pick');

let fetchCount = 0;

const stReq = cacheThis(
    async url => {
        // console.log({ url })
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
            fetchCount++;
            await new Promise(resolve => setTimeout(resolve, 2600)); // rate limited
        }
        
    },
    10
);
    

module.exports = async (ticker, detailed) => {
    try {
        // console.log({ ticker, detailed }, 'getting stocktwits sent')
        let { messages } = await stReq(`https://api.stocktwits.com/api/2/streams/symbol/${ticker}.json?filter=top`);
        const dates = await Pick.getUniqueDates();
        const twoDaysAgo = dates[dates.length - 3];

        const twoHoursAgo = Date.now() - 1000 * 60 * 60 * 2.5;

        const timestamp = twoHoursAgo || (new Date(twoDaysAgo)).getTime();
        strlog( (new Date(twoDaysAgo)).toLocaleString() )
        const last3DaysMessages = messages.filter(o => (new Date(o.created_at)).getTime() > timestamp)// (Date.now() - new Date(o.created_at).getTime()) < 1000 * 60 * 60 * 24 * 3);
        
        // strlog({last3DaysMessages})
        
        const totalCount = last3DaysMessages.length;
        const getSentiment = s => last3DaysMessages.filter(o => o.entities.sentiment && o.entities.sentiment.basic === s).length;
        const bearishCount = getSentiment('Bearish');
        const bullishCount = getSentiment('Bullish');
        // console.log('got stocktwits sent', ticker, { totalCount, bearishCount, bullishCount });

        // const bullishScore = (bullishCount / totalCount * 100) * 1.75;
        // let bullBearScore = (bullishCount - bearishCount) * 10 - bearishCount - (30 - totalCount);
        let bullBearScore = (bullishCount * 30) - (bearishCount * 45);
    
        let detailedData = {};
        // if (detailed && totalCount > 3) {
        //     const sentimentUrl = `https://api.stocktwits.com/api/2/symbols/${ticker}/sentiment.json`;
        //     const { data: sentimentData } = await stReq(sentimentUrl);
        //     const [{ bullish: mostRecentSentiment }] = sentimentData;
        //     const withSentiment = avgArray([bullBearScore, mostRecentSentiment]);
        //     detailedData = {
        //         mostRecentSentiment,
        //         withSentiment
        //     };
            
        //     const volumeUrl = `https://api.stocktwits.com/api/2/symbols/${ticker}/volume.json`;
        //     const { data: volumeData } = await stReq(volumeUrl);
        //     const [{ volume_change: todayVolumeChange }] = volumeData;
        //     const withSentAndVol = avgArray([
        //         ...new Array(6).fill(withSentiment),
        //         withSentiment * (1 + todayVolumeChange / 8)
        //     ]);
        //     detailedData = {
        //         ...detailedData,
        //         todayVolumeChange,
        //         withSentAndVol
        //     };
        // }
        
        const returnObj = {
            totalCount,
            bearishCount,
            bullishCount,
            bullBearScore,
            ...detailedData
        };
        console.log('STSENT', ticker, returnObj.bullBearScore, '....', fetchCount);
        return returnObj;
    } catch (e) {
        // console.error(e);
        return {};
    }
    
};