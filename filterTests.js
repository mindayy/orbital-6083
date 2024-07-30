const { Builder, By, until } = require('selenium-webdriver');
const chai = require('chai');
const expect = chai.expect;

describe('Filtering System Tests', function() {
  let driver;
  this.timeout(10000);

  before(async function() {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    await driver.quit();
  });

  it('should apply a single filter correctly', async function() {
    await driver.get('https://cartingexpress.netlify.app');

    // Apply a single filter
    await driver.wait(until.elementLocated(By.css('.banner')), 5000);
    await driver.findElement(By.css('.banner')).click();
    await driver.wait(until.elementLocated(By.css('.filter-bar')), 5000);
    let dropdownButton = await driver.wait(until.elementLocated(By.css('.dropdown-button')), 10000);
    await dropdownButton.click();
    await driver.wait(until.elementLocated(By.css('.filter-options')), 5000);
    await driver.findElement(By.css('input[value="S"]')).click();
    await driver.findElement(By.xpath('//button[text()="Apply Filters"]')).click();

    // Wait for results to load
    await driver.wait(until.elementLocated(By.css('.products-list')), 10000);
    let results = await driver.findElement(By.css('.products-list .size-list')).getText();

    // Verify results
    expect(results).to.include('S', 'The filter did not apply correctly.');
  });

  it('should apply multiple filters correctly', async function() {
    await driver.get('https://cartingexpress.netlify.app/');

    // Apply multiple filters
    await driver.wait(until.elementLocated(By.css('.banner')), 5000);
    await driver.findElement(By.css('.banner')).click();
    await driver.wait(until.elementLocated(By.css('.filter-bar')), 5000);
    let dropdownButton = await driver.wait(until.elementLocated(By.css('.dropdown-button')), 10000);
    await dropdownButton.click();
    await driver.wait(until.elementLocated(By.css('.filter-options')), 5000);
    await driver.findElement(By.css('input[value="S"]')).click();
    await driver.findElement(By.css('input[value="TTR"]')).click();
    await driver.findElement(By.xpath('//button[text()="Apply Filters"]')).click();

    // Wait for results to load
    await driver.wait(until.elementLocated(By.css('.products-list')), 10000);
    let results = await driver.findElement(By.css('.products-list')).getText();

    // Verify results
    expect(results).to.include('S', 'The color filter S did not apply correctly.');
    expect(results).to.include('TTR', 'The color filter TTR did not apply correctly.');
  });

  it('should clear filters correctly', async function() {
    await driver.get('https://cartingexpress.netlify.app/');

    // Get the count of all products before applying any filters
    let allProductsBefore = await driver.findElements(By.css('.product-list .product-item'));
    let countBefore = allProductsBefore.length;

    // Apply multiple filters
    await driver.wait(until.elementLocated(By.css('.banner')), 5000);
    await driver.findElement(By.css('.banner')).click();
    await driver.wait(until.elementLocated(By.css('.filter-bar')), 5000);
    let dropdownButton = await driver.wait(until.elementLocated(By.css('.dropdown-button')), 10000);
    await dropdownButton.click();
    await driver.wait(until.elementLocated(By.css('.filter-options')), 5000);
    await driver.findElement(By.css('input[value="S"]')).click();
    await driver.findElement(By.css('input[value="TTR"]')).click();
    await driver.findElement(By.xpath('//button[text()="Apply Filters"]')).click();
    await dropdownButton.click();
    await driver.wait(until.elementLocated(By.css('.filter-options')), 5000);
    await driver.findElement(By.xpath('//button[text()="Clear"]')).click();

    // Get the count of products after clearing filters
    let allProductsAfter = await driver.findElements(By.css('.product-list .product-item'));
    let countAfter = allProductsAfter.length;

    // Wait for results to load
    await driver.wait(until.elementLocated(By.css('.products-list')), 10000);
    let results = await driver.findElement(By.css('.products-list')).getText();

    // Verify results
    expect(countAfter).to.equal(countBefore, 'The number of products after clearing the filters does not match the initial count.');
  });

  it('should display "No products available" message correctly', async function() {
    await driver.get('https://cartingexpress.netlify.app/');

    // Apply multiple filters
    await driver.wait(until.elementLocated(By.css('.banner')), 5000);
    await driver.findElement(By.css('.banner')).click();
    await driver.wait(until.elementLocated(By.css('.filter-bar')), 5000);
    let dropdownButton = await driver.wait(until.elementLocated(By.css('.dropdown-button')), 10000);
    await dropdownButton.click();
    await driver.wait(until.elementLocated(By.css('.filter-options')), 5000);
    await driver.findElement(By.css('input[value="XXL"]')).click();
    await driver.findElement(By.css('input[value="TTR"]')).click();
    await driver.findElement(By.css('input[value="Pink"]')).click();
    await driver.findElement(By.xpath('//button[text()="Apply Filters"]')).click();

    // Wait for results to load
    await driver.wait(until.elementLocated(By.css('.product-data-container')), 10000);

    // Verify results
    let productDataContainer = await driver.findElement(By.css('.product-data-container'));
    let noProductsMessage;
    try {
      noProductsMessage = await productDataContainer.findElement(By.css('p')).getText();
      expect(noProductsMessage).to.equal('No products available', 'The "No products available" message is not displayed correctly.');
    } catch (error) {
      // Check if products are still being displayed when they shouldn't be
      let productsListText = await productDataContainer.getText();
      expect(productsListText).to.not.include('Product', 'Products should not be displayed when no matching products are found.');
    }
  });

});

