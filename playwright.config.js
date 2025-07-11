// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './e2e',
  timeout: 45000,
  expect: {
    timeout: 15000
  },
  retries: 2,
  use: {
    baseURL: 'https://www.automationexercise.com',
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 45000,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }], 
    ['json', { outputFile: 'playwright-report/report.json' }],
    ['list']
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
}); 