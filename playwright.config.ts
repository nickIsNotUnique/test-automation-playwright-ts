import { execSync } from 'node:child_process';

import { defineConfig, devices } from '@playwright/test';

function hostSupportsPlaywrightWebKit(): boolean {
  if (process.env.PLAYWRIGHT_SKIP_WEBKIT === '1') return false;
  if (process.platform !== 'darwin') return true;
  try {
    const version = execSync('sw_vers -productVersion', { encoding: 'utf8' }).trim();
    const major = parseInt(version.split('.')[0] ?? '0', 10);
    // WebKit is not bundled for older macOS (e.g. 13–14) in recent Playwright; Linux CI is unaffected.
    return major >= 15;
  } catch {
    return true;
  }
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: process.env.CI ? 'on' : 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: /@desktop/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@desktop/,
    },

    ...(hostSupportsPlaywrightWebKit()
      ? [
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
            grep: /@desktop/,
          },
        ]
      : []),

    /* Test against mobile viewports. */
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      grep: /@mobile/,
    },
    ...(hostSupportsPlaywrightWebKit()
      ? [
          {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
            grep: /@mobile/,
          },
        ]
      : []),

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
