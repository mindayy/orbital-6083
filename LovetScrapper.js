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
    await page.goto('https://lovet.sg/products', {
        waitUntil: 'domcontentloaded'
    });

    let results = [];
    const lastPageNumber = 77;

    for (let index = 1; index <= lastPageNumber; index++) {
        const productsOnPage = await page.evaluate(async () => {
            let data = [];
            let elements = document.querySelectorAll('.productrow');

            for (let product of elements) {
                try {
                    const shop = "Lovet";
                    const title = product.querySelector('.product-title a').textContent.trim();
                    const priceText = product.querySelector('.product-price .uc-price').textContent.trim();
                    const imageUrl = product.querySelector('.product-img img').getAttribute('src');
                    const productUrl = product.querySelector('.product-title a').getAttribute('href');
                    
                    const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // converts SGD $28.90 to just 28.9

                    // extract available sizes
                    const sizesList = Array.from(product.querySelectorAll('.size-options a.size-option'))
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

        results = results.concat(productsOnPage);

        console.log(`Scraped page ${index} with ${productsOnPage.length} products`);

        // Navigate to the next page if it exists
        if (index < lastPageNumber) {
            const nextPageButton = await page.$('ul > li.next > a > span');
            if (nextPageButton) {
                await nextPageButton.click();
                await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            } else {
                console.log('No more pages to scrape.');
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
    const ref = database.ref('lovet-products');
    await ref.set(results);
    console.log('Data uploaded to Firebase');

    return results;
};

scrapeData();
