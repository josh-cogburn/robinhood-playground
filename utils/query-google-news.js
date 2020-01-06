let googleNewsAPI = require("google-news-json");
const { wordFlags } = require('../settings');

const cacheThis = require('./cache-this');

module.exports = cacheThis(async query => {
  const { items } = await googleNewsAPI.getNews(googleNewsAPI.SEARCH, query, "en-US");
  const twentyFourHrsMs = 1000 * 60 * 60 * 24;
  const last24Hours = items.filter(result => result.created > Date.now() - twentyFourHrsMs);

  strlog({ last24Hours });
  const str = JSON.stringify(last24Hours).toLowerCase();

  return {
    newsInTheLast24Hrs: last24Hours,
    wordFlags: wordFlags
      .filter(word => str.includes(word))
      .map(word => ['gnews', word].join(''))
  };
});