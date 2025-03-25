import dotenv from 'dotenv';
import { chromium } from 'playwright';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Test Configuration
export const API_URL = process.env.API_URL || 'http://localhost:3001';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const TIMEOUT = process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT) : 30000;

// Create a configured axios instance for API testing
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Browser setup for Playwright
export async function setupBrowser() {
  const browser = await chromium.launch({
    headless: process.env.HEADLESS !== 'false', // Run headless by default
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0, // Slow down by ms to make tests easier to follow
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
    ignoreHTTPSErrors: true,
  });
  
  const page = await context.newPage();
  
  return { browser, context, page };
}

export async function teardownBrowser({ browser, context, page }) {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
}

// Helper functions
export async function waitForNetworkIdle(page, timeout = 5000) {
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch (error) {
    console.warn('Network did not become idle within the timeout period');
  }
}

// Health check functions
export async function checkHealth() {
  const status = { api: false, frontend: false };
  
  // Check API health by testing a known working endpoint
  try {
    console.log('Checking API at:', `${API_URL}/api/books`);
    const response = await axios.get(`${API_URL}/api/books`, { 
      timeout: 10000,
      validateStatus: () => true
    });
    
    // Check if response contains books data
    status.api = response.status === 200 && Array.isArray(response.data);
    
    console.log('API Books Endpoint Test:', {
      status: response.status, 
      isArray: Array.isArray(response.data),
      dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
    });
  } catch (error) {
    console.error('API books endpoint test failed:', error.message);
  }
  
  // Check frontend health
  try {
    console.log('Checking Frontend at:', FRONTEND_URL);
    const response = await axios.get(FRONTEND_URL, { 
      timeout: 10000,
      validateStatus: () => true
    });
    status.frontend = response.status >= 200 && response.status < 500;
    console.log('Frontend Health Response:', response.status);
  } catch (error) {
    console.error('Frontend health check failed:', error.message);
  }
  
  return status;
}

// Shared test utilities
export async function skipIfUnhealthy(condition, testFn) {
  if (!condition) {
    console.warn('Skipping test due to service unavailability');
    return;
  }
  await testFn();
}

// Global configuration for Vitest
export function setupGlobalConfig() {
  // Increase timeout for all tests
  globalThis.vitest?.setConfig({ testTimeout: TIMEOUT });
}

// Initialize global config
setupGlobalConfig(); 