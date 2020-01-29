const puppeteer = require('puppeteer');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const sendEmail = require('../utils/send-email');
const Pick = require('../models/Pick');


const sendScreenshot = async (numDays, queryString = '') => {
  
  const todaysDate = (await Pick.getUniqueDates()).pop();
  const screenshotName = `${todaysDate}${numDays !== 1 ? `-${numDays}day` : ''}${queryString ? '-' + queryString : ''}`;
  const path = `./screenshots/${screenshotName}.jpg`;

  const browser = await puppeteer.launch({ 
    headless: false,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox', 
    ],
  });
  const page = await browser.newPage();
  const dims = {
    width: 1680,
    height: 840
  };
  page.setViewport({ ...dims, deviceScaleFactor: 2 });

  await page.on('dialog', async dialog => {
    dialog.accept('j');
  });
  await page.goto(`http://chiefsmurph.com/stocks/?p=3000&numDays=${numDays}&${queryString}`);
  await page.waitFor(12000);
  await page.click("a");
  await page.waitFor(12000);
  await page.screenshot({
    path,
    quality: 100,
    clip: {
      x: 0,
      y: 107,
      ...dims
    }
  });
  // await page.waitFor(12000);
  await browser.close();
  await sendEmail(`daily trend screenshot for ${screenshotName}`, '', undefined, [
    path
  ]);
};

module.exports = async (numDays = 1) => {

  const days = [
    1,
    (new Date()).getDay() === 5 && numDays === 1 ? 5 : []
  ];

  for (let day of days) {
    await sendScreenshot(day);
    await sendScreenshot(day, 'balance');
  }
  
}