const puppeteer = require("puppeteer-extra")
// Enable stealth plugin with all evasions
puppeteer.use(require("puppeteer-extra-plugin-stealth")())

// add recaptcha plugin and provide it your 2captcha token
// 2captcha is the builtin solution provider but others work as well.
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
const recaptchaPlugin = RecaptchaPlugin({
  provider: { id: '2captcha', token: 'XXXXXXX' },
  visualFeedback: true
})
puppeteer.use(recaptchaPlugin)

const pageUtil = require('./page_util.js');

exports.runScript = function () {
  try {
    (async () => {
      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 5,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()

      await page.setViewport({ width: 1280, height: 800})
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
      });
      // No unwanted resources
      await page.setRequestInterception(true);
      const block_ressources = ['image', 'stylesheet', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset'];
      page.on('request', request => {
        if (block_ressources.indexOf(request.resourceType) > 0)
          request.abort();
        else
          request.continue();
      });

      // goto the provided list
      // await page.goto('https://lottery.broadwaydirect.com/show/hamilton/')

      // Should look like https://lottery.broadwaydirect.com/enter-lottery/?lottery=399326&window=popup
      url = process.argv[2]
      console.log(`Visiting lottery link at ${url}`)
      await page.goto(url)

      await page.waitFor(1000);

      // let childFrames = await page.mainFrame().childFrames();
      // console.log(`There are ${childFrames.length} child frames!`)

      // Enter our info
      await page.type('#dlslot_name_first', "Julian")
      await page.type('#dlslot_name_last', "Contreras")
      await page.type('#dlslot_email', "bangaloreblade@kermit.dev")

      await page.type('#dlslot_dob_month', "05")
      await page.type('#dlslot_dob_day', "02")
      await page.type('#dlslot_dob_year', "1994")
      await page.type('#dlslot_zip', "10025")

      await page.click('#dlslot_agree')

      await page.select('#dlslot_ticket_qty', "2")

      await page.solveRecaptchas()
    })()
  } catch (err) {
    console.error(err)
    return Promise.reject(new Error("Mission failed, we'll get em next time"));
  }
}

for (let j = 0; j < process.argv.length; j++) {
  console.log(j + ' -> ' + (process.argv[j]));
}

exports.runScript()

