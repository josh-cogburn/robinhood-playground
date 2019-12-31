let googleNewsAPI = require("google-news-json");
const { wordFlags } = require('../settings');
module.exports = async query => {
  const str = JSON.stringify(
    await googleNewsAPI.getNews(googleNewsAPI.SEARCH, query, "en-US")
  ).toLowerCase();
  return wordFlags
    .filter(word => str.includes(word))
    .map(word => ['gnews', word].join(''));
};