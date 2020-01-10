const puppeteer = require('puppeteer');
const getFilesSortedByDate = require('../utils/get-files-sorted-by-date');
const sendEmail = require('../utils/send-email');
const Pick = require('../models/Pick');


const sendScreenshot = async numDays => {
  
  const todaysDate = (await Pick.getUniqueDates()).pop();
  const screenshotName = `${todaysDate}${numDays !== 1 ? `-${numDays}day` : ''}`;

  const path = `./screenshots/${screenshotName}.jpg`;

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
    height: 855
  };
  page.setViewport({ ...dims, deviceScaleFactor: 2 });

  await page.on('dialog', async dialog => {
    console.log('DIALOGGG');
    dialog.accept('j');
  });
  await page.goto(`http://23.237.87.144:3000/?p=3000&numDays=${numDays}`);
  await page.waitFor(12000);
  await page.click("a");
  await page.waitFor(12000);
  await page.screenshot({
    path,
    quality: 100,
    clip: {
      x: 0,
      y: 100,
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

  await sendScreenshot(numDays);
  if ((new Date()).getDay() === 5 && numDays === 1) {
    await sendScreenshot(5);
  }
  
}