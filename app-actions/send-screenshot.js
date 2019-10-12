const puppeteer = require('puppeteer');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const sendEmail = require('../utils/send-email');
const Pick = require('../models/Pick');

module.exports = async (numDays = 1) => {

  const todaysDate = (await Pick.getUniqueDates()).pop();
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
  await page.goto(`http://107.173.6.167:3000/?${numDays}`);
  await page.waitFor(7000);
  await page.screenshot({
    path,
    quality: 100,
    clip: {
      x: 0,
      y: 125,
      ...dims
    }
  });
  await page.waitFor(12000);
  await browser.close();
  await sendEmail(`daily trend screenshot for ${todaysDate}`, '', undefined, [
    path
  ]);
}