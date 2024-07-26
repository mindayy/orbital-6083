const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid'); 
const admin = require('firebase-admin');
const serviceAccount = require('/Users/min/Downloads/orbital-6083-firebase-adminsdk-qj4zv-6073a3dcf0.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://orbital-6083-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const database = admin.database();

const scrapeData = async () => {
    const browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto('https://www.thetinselrack.com/products', {
        waitUntil: 'domcontentloaded'
    });

    let results = [];
    const uniqueProductUrls = new Set();
    const lastPageNumber = 83;
    const navigationTimeout = 60000;

    for (let index = 1; index <= lastPageNumber; index++) {
        const productsOnPage = await page.evaluate(async () => {
            let data = [];
            let elements = document.querySelectorAll('.productrow');

            for (let product of elements) {
                try {
                    const shop = "TTR";
                    const title = product.querySelector('.product-title a').textContent.trim();
                    
                    // check if the "Out of Stock" banner is present
                    const soldOutBanner = product.querySelector('.soldout-ribbons-text');
                    let sizesList = [];
                    
                    if (soldOutBanner) {
                        sizesList = []; // no sizes available 
                    } else {
                        // extract available sizes
                        sizesList = Array.from(product.querySelectorAll('.choose-size-button a.modal-load'))
                            .map(sizeElement => sizeElement.textContent.trim());
                    }

                    const priceElement = product.querySelector('.product-price .promoprice .uc-price') || 
                                         product.querySelector('.product-price .uc-price');
                    const priceText = priceElement ? priceElement.textContent.trim() : '0';
                    const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // converts $28.90 to just 28.9
                    
                    const imageUrl = product.querySelector('.product-img img').getAttribute('src');
                    const productUrl = product.querySelector('.product-title a').getAttribute('href');

                    console.log(shop, title, price, imageUrl, productUrl, sizesList);
                    data.push({ shop, title, price, imageUrl, productUrl, sizesList });
                } catch (error) {
                    console.error('Error extracting product data', error);
                }
            }
            return data;
        });

        // scrape unique products only (duplicate products on each page...)
        const uniqueProducts = productsOnPage.filter(product => {
            if (!uniqueProductUrls.has(product.productUrl)) {
                uniqueProductUrls.add(product.productUrl);
                return true;
            }
            return false;
        });

        results = results.concat(uniqueProducts);

        console.log(`Scraped page ${index} with ${uniqueProducts.length} products`);

        // Navigate to the next page if it exists
        if (index < lastPageNumber) {
            try {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: navigationTimeout }),
                    page.click('ul > li.next > a > i')
                ]);
                await page.waitForSelector('.productrow', { timeout: navigationTimeout });
            } catch (error) {
                console.log('Error navigating to the next page:', error);
                break;
            }
        }
    }

    // Close the browser when done
    await browser.close();

    // Add unique IDs to each product
    results = results.map(product => ({ ...product, id: uuidv4() }));

    // Output the results
    console.log(results);

    // Upload data to Firebase
    const ref = database.ref('TTR-products');
    await ref.set(results);
    console.log('Data uploaded to Firebase');

    return results;
};

scrapeData();
