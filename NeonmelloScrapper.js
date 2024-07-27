const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');
const serviceAccount = require('/Users/min/Downloads/orbital-6083-firebase-adminsdk-qj4zv-6073a3dcf0.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://orbital-6083-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const database = admin.database();

const mapSize = (sizeText) => {
    const lowerSizeText = sizeText.toLowerCase();
    if (/xxs/.test(lowerSizeText)) return 'XXS';
    if (/extra small/.test(lowerSizeText)) return 'XS';
    if (/small/.test(lowerSizeText)) return 'S';
    if (/medium/.test(lowerSizeText)) return 'M';
    if (/large/.test(lowerSizeText)) return 'L';
    if (/extra large/.test(lowerSizeText)) return 'XL';
    if (/xxl/.test(lowerSizeText)) return 'XXL';
    return sizeText.toUpperCase(); // default
};

const scrapeData = async () => {
    const browser = await puppeteer.launch({
        headless: false, 
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.goto('https://www.neonmello.com/collections/all', {
        waitUntil: 'domcontentloaded'
    });

    let results = [];
    const lastPageNumber = 3;
    const navigationTimeout = 60000;

    for (let index = 1; index <= lastPageNumber; index++) {
        const productsOnPage = await page.evaluate((mapSize) => {
            let data = [];
            let elements = document.querySelectorAll('.product--root');

            for (let product of elements) {
                try {
                    const shop = "Neonmello";
                    const title = product.querySelector('.product--details .product--title').textContent.trim();

                    const srcset = product.querySelector('.image--container img').getAttribute('data-srcset');
                    const srcsetArray = srcset.split(',').map(item => item.trim().split(' ')[0]);
                    const relativeImageUrl = srcsetArray[srcsetArray.length - 1];
                    const imageUrl = relativeImageUrl.startsWith('//') ? `https:${relativeImageUrl}` : relativeImageUrl;

                    const productUrl = new URL(product.querySelector('.product--root a').getAttribute('href'), 'https://www.neonmello.com').href;

                    const priceElement = product.querySelector('.product--price-wrapper .product--price .money') || 
                                            product.querySelector('.product--price-wrapper .product--compare-price .money');
                    const priceText = priceElement ? priceElement.textContent.trim() : '0';
                    const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // converts $28.90 SGD to just 28.9

                    // extract available sizes
                    const sizesList = Array.from(product.querySelectorAll('.hc-collections-size__size'))
                        .filter(sizeElement => !sizeElement.classList.contains('hc-soldout'))
                        .map(sizeElement => sizeElement.querySelector('div').textContent.trim());
                        
                    console.log(shop, title, price, imageUrl, productUrl, sizesList);
                    data.push({ shop, title, price, imageUrl, productUrl, sizesList });
                } catch (error) {
                    console.error('Error extracting product data', error);
                }
            }
            return data;
        }, mapSize);

        results = results.concat(productsOnPage);

        console.log(`Scraped page ${index} with ${productsOnPage.length} products`);

        // Navigate to the next page if it exists
        if (index < lastPageNumber) {
            try {
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: navigationTimeout }),
                    page.click('div > div.pagination--right-arrow > a > svg')
                ]);
                await page.waitForSelector('.product--root', { timeout: navigationTimeout });
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
    const ref = database.ref('neonmello-products');
    await ref.set(results);
    console.log('Data uploaded to Firebase');

    return results;
};

scrapeData();