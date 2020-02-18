let googleNewsAPI = require("google-news-json");
const { wordFlags } = require('../settings');

const cacheThis = require('./cache-this');

module.exports = cacheThis(async ticker => {  
  const { items = [] } = await googleNewsAPI.getNews(googleNewsAPI.SEARCH, ticker, "en-US").catch(e => {
    console.log('error', e);
    return {};
  });
  const twentyFourHrsMs = 1000 * 60 * 60 * 48;
  const recentNews = items
    .filter(result => result.created > Date.now() - twentyFourHrsMs)
    .filter(result => result.title.includes(ticker.toUpperCase()))
    .sort((a, b) => b.created - a.created);

  // strlog({ recentNews });
  const str = JSON.stringify(recentNews).toLowerCase();

  console.log(`found ${recentNews.length} recent news articles for ${ticker}`);
  return {
    recentNews: recentNews.slice(0, 3),
    wordFlags: wordFlags
      .filter(word => str.includes(word))
      .map(word => ['gnews', word].join(''))
  };
});