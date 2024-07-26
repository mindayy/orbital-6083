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
    await page.goto('https://www.thethreadtheory.com/products', {
        waitUntil: 'domcontentloaded'
    });

    let results = [];
    const uniqueProductUrls = new Set();

    const scrollAndLoad = async () => {
        let previousHeight;
        while (true) {
            const productsOnPage = await page.evaluate(async () => {
                let data = [];
                let elements = document.querySelectorAll('.productrow');

                for (let product of elements) {
                    try {
                        const shop = "TTT";
                        const title = product.querySelector('.product-title a').textContent.trim();
                        const imageUrl = product.querySelector('.product-img img').getAttribute('src');
                        const productUrl = product.querySelector('.product-title a').getAttribute('href');
                        const priceElement = product.querySelector('.product-price .promoprice .uc-price') || 
                                            product.querySelector('.product-price .uc-price');
                        const priceText = priceElement ? priceElement.textContent.trim() : '0';

                        const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // converts SGD $28.90 to just 28.9

                        // extract available sizes
                        const sizesList = Array.from(product.querySelectorAll('.productrow-size-wrapper a.productrow-size-option'))
                        .filter(sizeElement => !sizeElement.classList.contains('soldout'))
                        .map(sizeElement => sizeElement.textContent.trim());

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

            console.log(`Scraped page with ${uniqueProducts.length} products`);

            // scroll down to load more products
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));
            await waitFor(3000);

            const currentHeight = await page.evaluate('document.body.scrollHeight');
            if (currentHeight === previousHeight) {
                break; // exit loop if no more new content is loaded
            }
        }
    };
    
    await scrollAndLoad();

    // Close the browser when done
    await browser.close();
    
    // Add unique IDs to each product
    results = results.map(product => ({ ...product, id: uuidv4() }));

    // Output the results
    console.log(results);

    // Upload data to Firebase
    const ref = database.ref('TTT-products');
    await ref.set(results);
    console.log('Data uploaded to Firebase');

    return results;
};

scrapeData();