const puppeteer = require('puppeteer');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const sendEmail = require('../utils/send-email');

module.exports = async () => {

  const todaysDate = (await getFilesSortedByDate('prediction-models'))[0];
  const path = `./screenshots/${todaysDate}.jpg`;

  const browser = await puppeteer.launch({ 
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
    ],
  });
  const page = await browser.newPage();
  const dims = {
    width: 1680,
    height: 900
  };
  page.setViewport({ ...dims, deviceScaleFactor: 2 });
  await page.goto('http://107.173.6.167:3000/');
  await page.waitFor(4000);
  await page.screenshot({
    path,
    quality: 100,
    clip: {
      x: 0,
      y: 135,
      ...dims
    }
  });
  await browser.close();
  await sendEmail(`daily trend screenshot for ${todaysDate}`, '', undefined, [
    path
  ]);
}