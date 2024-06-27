const puppeteer = require('puppeteer');

const scrapeData = async () => {
    const browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.shopsassydream.com/category/tops', {
        waitUntil: "domcontentloaded"
    }); 

    // wait for products to load
    //await page.waitForSelector('.items .row');

    // extract data for each product
    const products = await page.$$('.productrow');

    
    // Let items = [];
    for (const product of products) {
        try {
            const title = await product.$eval('.product-title > a', element => element.textContent.trim());
            const price = await product.$eval('.product-price > .uc-price', element => element.textContent.trim());
            const imageUrl = await product.$eval('.product-img > a.ga_track.hover.gtm_processed > img', img => img.getAttribute('src'));

            console.log(title, price, imageUrl);
            // items.push({title, price, imageUrl});

        } catch (error) {
            console.error('Error extracting product data', error);
        }
    }
    // Close the browser when done
    await browser.close();
};


scrapeData();
exports.scrapeData = scrapeData;