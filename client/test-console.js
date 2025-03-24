import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Log all console messages from the page
    page.on('console', (message) => {
      console.log(`BROWSER CONSOLE: ${message.type().toUpperCase()}: ${message.text()}`);
    });
    
    // Log all page errors
    page.on('pageerror', (error) => {
      console.log(`BROWSER PAGE ERROR: ${error.message}`);
    });
    
    // Log all network errors
    page.on('requestfailed', (request) => {
      console.log(`NETWORK ERROR: ${request.url()} ${request.failure().errorText}`);
    });
    
    // Navigate to the application
    console.log('Navigating to http://localhost:8082/book/1984...');
    await page.goto('http://localhost:8082/book/1984', { waitUntil: 'networkidle0', timeout: 60000 });
    
    // Click on the Quotes tab
    console.log('Clicking on the Quotes tab...');
    // Wait a bit for the page to stabilize (using setTimeout)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Find and click the Quotes tab using a more basic selector
      await page.waitForSelector('button[role="tab"]', { timeout: 5000 });
      
      // Get all tabs and find the one with "Quotes" text
      const tabHandles = await page.$$('button[role="tab"]');
      
      for (const handle of tabHandles) {
        const text = await page.evaluate(el => el.textContent, handle);
        if (text && text.includes('Quotes')) {
          await handle.click();
          console.log('Found and clicked on Quotes tab');
          break;
        }
      }
      
      // Wait for any API requests to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Log any console errors that occurred after clicking
      console.log('Checking for errors after clicking Quotes tab');
    } catch (err) {
      console.log('Error clicking Quotes tab:', err.message);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'app-screenshot.png' });
    
    // Close the browser
    await browser.close();
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
})(); 