const puppeteer = require('puppeteer');
const $=require('cheerio');
(async ()=>{
    const browser= await puppeteer.launch({ headless: false });
    const page= await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 720,
        deviceScaleFactor: 1,
    });
    await page.goto('https://www.google.com/search?q=lonely&source=lnms&tbm=vid');
    const search=await page.$('#search');
    await page.click('#search')
    const title=await search.$$eval('a',options => options.map(option => option.href))
    const page2= await browser.newPage();
    // page2.click('#ytp-caption-window-container ytp-large-play-button ytp-button');
    page2.goto(title[0]);
})()