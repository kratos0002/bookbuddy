# BookBuddy Testing Suite

This directory contains comprehensive tests for the BookBuddy application. The tests are designed to verify both technical integrations and user flows.

## Test Structure

The test suite is divided into two main categories:

1. **API Tests** (`api.test.js`): These tests verify backend functionality by directly calling API endpoints.
2. **E2E Tests** (`e2e.test.js`): These tests simulate user interactions with the application using Playwright.

## Setup and Configuration

### Prerequisites

- Node.js 16+ installed
- BookBuddy API running (locally or in production)
- BookBuddy frontend running (locally or in production)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
# API and Frontend URLs
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# For production testing
# API_URL=https://bookbuddy-api.onrender.com
# FRONTEND_URL=https://bookbuddy.netlify.app

# Test Configuration
TEST_TIMEOUT=30000
HEADLESS=true
SLOW_MO=0
```

### Installing Dependencies

```bash
npm install
```

## Running Tests

### All Tests

```bash
npm test
```

### API Tests Only

```bash
npm run test:api
```

### E2E Tests Only

```bash
npm run test:e2e
```

### Watch Mode (Development)

```bash
npm run test:watch
```

## Debugging Tests

### Viewing Browser Interactions

To run E2E tests with a visible browser:

```bash
HEADLESS=false npm run test:e2e
```

To slow down browser interactions (useful for debugging):

```bash
HEADLESS=false SLOW_MO=100 npm run test:e2e
```

### Troubleshooting

**Tests failing due to timeouts?**
- Increase the timeout by setting `TEST_TIMEOUT=60000` in your `.env` file

**Health checks failing?**
- Ensure both API and frontend are running
- Check the URLs in your `.env` file are correct
- Verify the API's `/health` endpoint is responding

## Adding New Tests

### API Tests

Add new API tests by extending the test suites in `api.test.js`. Example:

```javascript
describe('New Feature API', () => {
  it('Should return expected data', async () => {
    const response = await apiClient.get('/api/new-feature');
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('key');
  });
});
```

### E2E Tests

Add new E2E tests by extending the test suites in `e2e.test.js`. Example:

```javascript
describe('New User Flow', () => {
  it('Should complete the new user flow', async () => {
    // Navigate to the starting page
    await page.goto(`${FRONTEND_URL}/new-feature`);
    
    // Interact with the page
    await page.click('button:has-text("Start")');
    
    // Verify the outcome
    const successMessage = await page.locator('.success-message');
    expect(await successMessage.isVisible()).toBe(true);
  });
});
```

## CI/CD Integration

These tests are designed to be run in CI/CD pipelines. Add the following steps to your pipeline:

```yaml
- name: Install dependencies
  run: npm install

- name: Run tests
  run: npm test
  env:
    API_URL: ${{ secrets.API_URL }}
    FRONTEND_URL: ${{ secrets.FRONTEND_URL }}
    HEADLESS: true
```

## Testing

BookBuddy includes a comprehensive testing suite for both API and E2E testing.

### Running Tests

Make sure to set the correct environment variables before running tests:

```bash
# Set the environment variables for testing
export API_URL=https://bookbuddy-qpi.onrender.com
export FRONTEND_URL=https://bookbuddy.netlify.app
```

To run all tests:

```bash
npm test
```

To run API tests only:

```bash
npm run test:api
```

To run E2E tests only:

```bash
npm run test:e2e
```

To run chat tests only:

```bash
npm run test:chat
```

### Local Testing

We've added scripts to run tests against a local development server:

```bash
# Run all tests against local servers
npm run test:local

# Run API tests against local server
npm run test:api:local

# Run E2E tests against local server
npm run test:e2e:local

# Run chat tests against local server
npm run test:chat:local
```

### Error Handling in Tests

The test suite includes robust error handling to accommodate different scenarios:

1. **API Health Checks**: Tests automatically check if the API is healthy before attempting to run tests
2. **404 Page Handling**: E2E tests can handle 404 pages and skip relevant tests when necessary
3. **HTML Response Detection**: Tests detect when the API returns HTML instead of JSON and adjust accordingly
4. **Graceful Degradation**: Tests will skip rather than fail when services are unavailable, providing useful feedback

### Test Structure

- **API Tests** (`api.test.js`): Tests the backend API functionality
- **E2E Tests** (`e2e.test.js`): Tests the frontend user flows using Playwright
- **Chat Tests** (`chat.test.js`): Tests specifically for the chat functionality

For more details on testing, see the [tests README](./tests/README.md). 