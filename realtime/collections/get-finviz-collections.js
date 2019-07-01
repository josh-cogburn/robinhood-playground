const puppeteer = require('puppeteer');
const config = require('./finviz-config');

const scrapeFizbizUrl = async (browser, url) => {
    try {
        console.log(`getting ${url} finviz style`)
        const page = await browser.newPage();
        await page.goto(url);
        const results = await page.evaluate(() => {
            const trs = Array.from(
                document.querySelectorAll('#screener-content tr:nth-child(4) table tr')
            ).slice(1);
            const tickers = trs.map(tr => {
                const getTD = num => tr.querySelector(`td:nth-child(${num})`).textContent;
                return getTD(2);  // ticker
                // return {
                //     ticker: getTD(2),
                //     price: Number(getTD(9)),
                //     trend: getTD(10)
                // };
            });
            return tickers;
        });
        await page.close();
        return results;
    } catch (e) {
        console.error(e);
    }
};

const getFinvizCollections = async () => {
  const browser = await puppeteer.launch({ 
      headless: true,
      args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
      ],
  });
  const asArray = await mapLimit(Object.keys(config), 1, async collectionName => ({
      collectionName,
      data: await scrapeFizbizUrl(browser, config[collectionName])
  }), {});
  await browser.close();
  return asArray.reduce((acc, { collectionName, data }) => ({
      ...acc,
      [collectionName]: data
  }), {});
};

module.exports = getFinvizCollections;