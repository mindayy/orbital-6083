const puppeteer = require('puppeteer');
const admin = require('firebase-admin');
const serviceAccount = require('/Users/min/Downloads/orbital-6083-firebase-adminsdk-qj4zv-4841409f8f.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://orbital-6083-default-rtdb.asia-southeast1.firebasedatabase.app"
  });

const database = admin.database();

const scrapeData = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false
    });

    const page = await browser.newPage();
    await page.goto('https://shopsassydream.com/products', {
        waitUntil: "domcontentloaded"
    });

    let results = [];
    const lastPageNumber = 28; 
    for (let index = 1; index <= lastPageNumber; index++) {
        // await page.waitForSelector('.items .row');

        const productsOnPage = await page.evaluate(() => {
            let data = [];
            let elements = document.querySelectorAll('.productrow');
            elements.forEach(product => {
                try {
                    const title = product.querySelector('.product-title a').textContent.trim();
                    const price = product.querySelector('.product-price .uc-price').textContent.trim();
                    const imageUrl = product.querySelector('.product-img img').getAttribute('src');
        
                    console.log(title, price, imageUrl);
                    data.push({title, price, imageUrl});
                } catch (error) {
                    console.error('Error extracting product data', error);
                }
            });
            return data;
        });

        results = results.concat(productsOnPage);

        console.log(`Scraped page ${index} with ${productsOnPage.length} products`);

        // Navigate to the next page if it exists
        if (index < lastPageNumber) {
            const nextPageButton = await page.$('ul > li.next > a'); 
            if (nextPageButton) {
                await nextPageButton.click();
                await page.waitForNavigation({ 
                    waitUntil: 'domcontentloaded' 
                });
            } else {
                console.log('No more pages to scrape.');
                break;
            }
        }
    }

    // Close the browser when done
    await browser.close();
    // Output the results
    console.log(results);

    const ref = database.ref('SSS-products');
    await ref.set(results);
    console.log('Data uploaded to Firebase');
    return results;
};

scrapeData();