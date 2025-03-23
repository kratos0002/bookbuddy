import puppeteer from 'puppeteer';

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    
    // Capture errors
    page.on('pageerror', error => {
      console.log('PAGE ERROR:', error.message);
    });
    
    // Capture network errors
    page.on('requestfailed', request => {
      console.log(`NETWORK ERROR: ${request.url()} ${request.failure().errorText}`);
    });
    
    console.log('Navigating to http://localhost:8085/...');
    await page.goto('http://localhost:8085/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    
    console.log('Page loaded successfully');
    
    // Take a screenshot as evidence
    await page.screenshot({ path: 'screenshot.png' });
    console.log('Screenshot saved to screenshot.png');
    
    await browser.close();
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
})(); 