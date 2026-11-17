// ============================================================
// F-18: Configuration Deep Dive
// ============================================================
// CoD Campaign Analogy:
// Before deploying, you configure your gear at the ARMOURY:
//   - Which weapon? (which browser?)
//   - Silencer on or off? (headless or headed?)
//   - How long to wait for backup? (timeout settings)
//   - Night vision? (viewport size for mobile testing)
//   - Record the mission? (screenshots, videos, traces)
//
// playwright.config.ts is YOUR ARMOURY — it controls
// how ALL your tests run. In this lesson, we'll TEST
// different config options to understand what they do.
//
// Key config options:
//   timeout        = how long a test can run before failing
//   retries        = how many times to retry a failed test
//   workers        = how many tests run at the same time
//   use.baseURL    = the starting website for all tests
//   use.headless   = show the browser or run invisible
//   use.viewport   = screen size (desktop, tablet, mobile)
//   use.screenshot = take screenshots on failure
//   use.video      = record video of tests
//   use.trace      = record detailed trace for debugging
//   projects       = run tests on multiple browsers
// ============================================================

import { test, expect } from '@playwright/test';

// ============================================================
// SECTION 1: Timeout Settings — How Long to Wait
// ============================================================
// Timeouts control how long Playwright waits before giving up.
//
// CoD Analogy: Every mission has a TIME LIMIT.
// If you don't complete it in time, mission fails.
//
// Types of timeouts:
//   test timeout       = max time for the ENTIRE test
//   expect timeout     = max time for ONE assertion
//   navigation timeout = max time for page.goto()
//   action timeout     = max time for click(), fill(), etc.
//
// Set in config:
//   timeout: 30000           → test timeout (30 seconds)
//   expect: { timeout: 5000 } → assertion timeout (5 seconds)
//
// Override per-test:
//   test.setTimeout(60000)   → this test gets 60 seconds
// ============================================================

test.describe('Section 1: Timeout Settings', () => {

  test('default timeout works for fast tests', async ({ page }) => {
    // --- This test finishes quickly, well within the timeout ---
    await page.setContent('<h1>Fast Mission</h1>');
    await expect(page.locator('h1')).toHaveText('Fast Mission');
  });

  test('custom test timeout for slow operations', async ({ page }) => {
    // --- Give this specific test MORE time ---
    // test.setTimeout(60000) = "this mission gets 60 seconds"
    // Useful for tests that load slow websites or do lots of steps
    test.setTimeout(60000);

    await page.setContent(`
      <div id="loader">Loading...</div>
      <div id="content" style="display:none;">Content loaded!</div>
      <script>
        setTimeout(() => {
          document.getElementById('loader').style.display = 'none';
          document.getElementById('content').style.display = 'block';
        }, 3000);
      </script>
    `);

    // Wait for content with a custom assertion timeout
    // { timeout: 10000 } = wait up to 10 seconds for this ONE check
    await expect(page.locator('#content')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#content')).toHaveText('Content loaded!');
  });

  test('assertion-level timeout override', async ({ page }) => {
    // --- Each assertion can have its OWN timeout ---
    await page.setContent(`
      <button id="btn">Click Me</button>
      <div id="result" style="display:none;">Done!</div>
      <script>
        document.getElementById('btn').addEventListener('click', () => {
          setTimeout(() => {
            document.getElementById('result').style.display = 'block';
          }, 2000);
        });
      </script>
    `);

    await page.locator('#btn').click();

    // This assertion waits up to 5 seconds (overriding the default)
    await expect(page.locator('#result')).toBeVisible({ timeout: 5000 });
  });
});

// ============================================================
// SECTION 2: Viewport — Screen Size Configuration
// ============================================================
// viewport sets the browser window size.
// This is how you test on different devices:
//   Desktop: { width: 1280, height: 720 }
//   Tablet:  { width: 768, height: 1024 }
//   Mobile:  { width: 375, height: 667 }
//
// CoD Analogy: Testing your gear in different environments:
//   Desert, jungle, arctic — same mission, different terrain.
//   Desktop, tablet, mobile — same website, different screens.
//
// Set in config:
//   use: { viewport: { width: 1280, height: 720 } }
//
// Override per-test:
//   test.use({ viewport: { width: 375, height: 667 } })
// ============================================================

test.describe('Section 2: Viewport — Screen Sizes', () => {

  test('default viewport shows full content', async ({ page }) => {
    await page.setContent(`
      <div id="app" style="width: 100%; max-width: 1200px; margin: 0 auto;">
        <h1>Desktop View</h1>
        <div id="sidebar" style="width: 300px; float: left;">Sidebar</div>
        <div id="main" style="margin-left: 320px;">Main Content</div>
      </div>
    `);

    // On desktop, both sidebar and main content are visible
    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(page.locator('#main')).toBeVisible();

    // Check the viewport size using JavaScript
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    // Default viewport from your config — should be reasonable width
    expect(viewportWidth).toBeGreaterThan(500);
  });
});

// --- Test with a MOBILE viewport ---
test.describe('Mobile Viewport Tests', () => {
  // --- test.use() changes settings for ALL tests in this describe ---
  // This is like switching to mobile gear for these missions
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile viewport is 375px wide', async ({ page }) => {
    await page.setContent(`
      <div id="app">
        <h1>Mobile View</h1>
        <p id="info">Screen width will be small</p>
      </div>
    `);

    // Verify the viewport is mobile-sized
    const width = await page.evaluate(() => window.innerWidth);
    expect(width).toBe(375);

    await expect(page.locator('h1')).toHaveText('Mobile View');
  });

  test('responsive layout adjusts for mobile', async ({ page }) => {
    await page.setContent(`
      <style>
        .container { display: flex; gap: 20px; }
        .card { padding: 10px; border: 1px solid #ccc; flex: 1; }
        @media (max-width: 600px) {
          .container { flex-direction: column; }
        }
      </style>
      <div class="container">
        <div class="card" id="card1">Card 1</div>
        <div class="card" id="card2">Card 2</div>
        <div class="card" id="card3">Card 3</div>
      </div>
    `);

    // On mobile (375px), cards should stack vertically
    // Both cards should still be visible
    await expect(page.locator('#card1')).toBeVisible();
    await expect(page.locator('#card2')).toBeVisible();
    await expect(page.locator('#card3')).toBeVisible();
  });
});

// --- Test with a TABLET viewport ---
test.describe('Tablet Viewport Tests', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('tablet viewport is 768px wide', async ({ page }) => {
    await page.setContent('<h1>Tablet View</h1>');

    const width = await page.evaluate(() => window.innerWidth);
    expect(width).toBe(768);
  });
});

// ============================================================
// SECTION 3: Browser-Specific Settings with test.use()
// ============================================================
// test.use() lets you change ANY setting for a group of tests.
// This includes viewport, locale, timezone, permissions, etc.
//
// CoD Analogy: Different missions need different gear configs.
// A stealth mission uses a silencer. A day mission uses no NVG.
// test.use() is like loading a specific gear preset.
// ============================================================

test.describe('Section 3: Locale & Timezone', () => {
  // --- Change the browser's language and timezone ---
  test.use({
    locale: 'fr-FR',           // French language
    timezoneId: 'Europe/Paris', // Paris timezone
  });

  test('should use French locale', async ({ page }) => {
    // The browser will report French locale
    const locale = await page.evaluate(() => navigator.language);
    expect(locale).toBe('fr-FR');
  });

  test('should use Paris timezone', async ({ page }) => {
    // Check the timezone
    const timezone = await page.evaluate(() =>
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    expect(timezone).toBe('Europe/Paris');
  });
});

test.describe('Section 3b: JavaScript Disabled', () => {
  // --- Test with JavaScript DISABLED ---
  // Some users browse without JS. Your site should still work!
  test.use({ javaScriptEnabled: false });

  test('page works without JavaScript', async ({ page }) => {
    await page.setContent(`
      <h1>No JavaScript Page</h1>
      <p id="static-content">This content doesn't need JavaScript</p>
      <noscript>
        <p id="noscript-msg">JavaScript is disabled</p>
      </noscript>
    `);

    // Static content should still be visible
    await expect(page.locator('#static-content')).toBeVisible();
    // The <noscript> content should also be visible
    await expect(page.locator('#noscript-msg')).toBeVisible();
  });
});

// ============================================================
// SECTION 4: Retries — Second Chances
// ============================================================
// Retries let a failed test try again automatically.
// Set in config: retries: 1 (or 2, etc.)
//
// CoD Analogy: If you fail a mission, you get to RETRY from
// the last checkpoint. retries: 1 means ONE retry attempt.
//
// In your config, you already have retries: 1
// This means every failed test gets ONE more chance.
//
// You can also set retries per-test with test.describe.configure()
// ============================================================

test.describe('Section 4: Retry Behavior', () => {

  test('this test always passes — no retry needed', async ({ page }) => {
    await page.setContent('<h1>Stable Mission</h1>');
    await expect(page.locator('h1')).toHaveText('Stable Mission');
  });

  test('retry info is available in the test', async ({ page }) => {
    // --- You can check retry info inside a test ---
    // test.info().retry = which attempt this is (0 = first try)
    const retryNumber = test.info().retry;

    await page.setContent(`
      <h1>Retry Info</h1>
      <p id="attempt">Attempt: ${retryNumber}</p>
    `);

    await expect(page.locator('h1')).toHaveText('Retry Info');
    // On the first run, retry should be 0
    // If this test failed and retried, retry would be 1
    console.log(`Current retry attempt: ${retryNumber}`);
  });
});

// ============================================================
// SECTION 5: Projects — Multi-Browser Testing
// ============================================================
// "projects" in config lets you run tests on MULTIPLE browsers:
//   Chromium, Firefox, WebKit (Safari)
//
// CoD Analogy: Testing your strategy on different battlefields.
// A plan that works in the desert might fail in the jungle.
// A website that works in Chrome might break in Safari.
//
// Your current config runs only Chromium. In real projects,
// you'd add Firefox and WebKit too.
//
// These tests VERIFY which browser is running.
// ============================================================

test.describe('Section 5: Browser Detection', () => {

  test('should detect the current browser', async ({ page, browserName }) => {
    // --- browserName is a built-in fixture ---
    // It tells you which browser is running this test
    // 'chromium', 'firefox', or 'webkit'

    await page.setContent(`
      <h1>Browser Test</h1>
      <p id="browser">Running on: ${browserName}</p>
    `);

    await expect(page.locator('#browser')).toContainText(browserName);
    console.log(`Test is running on: ${browserName}`);

    // Since your config uses Chromium, this should be 'chromium'
    expect(browserName).toBe('chromium');
  });

  test('browser-specific behavior', async ({ page, browserName }) => {
    // --- You can write browser-specific logic ---
    // Some features only work in certain browsers

    await page.setContent(`
      <h1>Feature Detection</h1>
      <div id="result"></div>
      <script>
        // Check if the browser supports a modern API
        const supportsClipboard = !!navigator.clipboard;
        document.getElementById('result').textContent =
          supportsClipboard ? 'Clipboard API: supported' : 'Clipboard API: not supported';
      </script>
    `);

    await expect(page.locator('#result')).toBeVisible();
    console.log(`Browser: ${browserName}`);
  });
});

// ============================================================
// SECTION 6: Base URL — Your Home Base
// ============================================================
// baseURL in config sets a starting URL for ALL tests.
// Instead of writing the full URL every time:
//   page.goto('https://the-internet.herokuapp.com/login')
// You write:
//   page.goto('/login')
// And Playwright adds the baseURL automatically!
//
// CoD Analogy: baseURL is your FORWARD OPERATING BASE.
// Every mission starts from there. You just say which
// sector to go to, not the full GPS coordinates.
//
// Your config has: baseURL: 'https://example.com'
// ============================================================

test.describe('Section 6: Base URL Usage', () => {

  test('baseURL is applied to relative paths', async ({ page }) => {
    // --- page.goto('/') uses the baseURL from config ---
    // Your config has baseURL: 'https://example.com'
    // So page.goto('/') goes to https://example.com/

    await page.goto('/');

    // Verify we're on the base URL
    const url = page.url();
    console.log(`Current URL: ${url}`);
    // The URL should contain the baseURL domain
    expect(url).toBeTruthy();
  });

  test('full URLs override baseURL', async ({ page }) => {
    // --- A full URL ignores baseURL ---
    // If you write the complete URL, baseURL is NOT added
    await page.goto('https://the-internet.herokuapp.com/login');

    // This should be the full URL, NOT baseURL + this URL
    await expect(page).toHaveURL(/the-internet/);
  });
});

// ============================================================
// SECTION 7: Screenshots & Traces — Mission Recording
// ============================================================
// Config can automatically capture evidence:
//   screenshot: 'on'      → screenshot after EVERY test
//   screenshot: 'only-on-failure' → only when tests FAIL
//   video: 'on'           → record video of every test
//   trace: 'on-first-retry' → record trace on retry
//
// CoD Analogy: Like having a helmet cam that records everything.
//   'on'              = always recording
//   'only-on-failure' = only saves footage of failed missions
//   'on-first-retry'  = records when you retry a failed mission
//
// These tests demonstrate taking manual screenshots.
// ============================================================

test.describe('Section 7: Screenshots', () => {

  test('can take a manual screenshot', async ({ page }) => {
    await page.setContent(`
      <h1>Screenshot Test</h1>
      <div style="background: #333; color: #0f0; padding: 20px; font-family: monospace;">
        <p>OPERATOR: TIPU</p>
        <p>STATUS: ACTIVE</p>
        <p>MISSION: F-18 Configuration</p>
      </div>
    `);

    // --- Take a screenshot programmatically ---
    // page.screenshot() captures the current page
    // { path: 'filename.png' } saves it to a file
    // In real projects, screenshots go to a reports folder
    await page.screenshot({ path: 'test-results/f18-screenshot-test.png' });

    // The test still passes — screenshot is just a side effect
    await expect(page.locator('h1')).toHaveText('Screenshot Test');
  });

  test('can take a screenshot of a specific element', async ({ page }) => {
    await page.setContent(`
      <h1>Element Screenshot</h1>
      <div id="target" style="background: #1a1a2e; color: #e94560; padding: 30px; border: 2px solid #e94560;">
        <h2>MISSION BRIEFING</h2>
        <p>Objective: Learn Playwright Config</p>
        <p>Difficulty: CAPTAIN</p>
      </div>
      <p>This text is OUTSIDE the target</p>
    `);

    // --- Screenshot of JUST one element ---
    // Only captures the #target div, not the whole page
    const target = page.locator('#target');
    await target.screenshot({ path: 'test-results/f18-element-screenshot.png' });

    await expect(target).toBeVisible();
  });
});

// ============================================================
// SECTION 8: Real Mission — Configuration Verification
// ============================================================
// A complete test that verifies your current config is working.
// This reads values from the actual Playwright config.
// ============================================================

test.describe('Section 8: Config Verification — Real Mission', () => {

  test('verify test timeout is working', async ({ page }) => {
    // --- Check that the test has a timeout set ---
    const testInfo = test.info();
    console.log(`Test timeout: ${testInfo.timeout}ms`);

    // Your config has timeout: 30000 (30 seconds)
    // With slowMo and other factors, it might vary
    expect(testInfo.timeout).toBeGreaterThan(0);

    await page.setContent('<h1>Config Check: Timeout</h1>');
    await expect(page.locator('h1')).toHaveText('Config Check: Timeout');
  });

  test('verify retry count', async ({ page }) => {
    const testInfo = test.info();
    // testInfo.retry tells us which retry attempt this is
    // 0 = first try (not a retry)
    console.log(`Current retry: ${testInfo.retry}`);
    console.log(`Test title: ${testInfo.title}`);
    console.log(`Test file: ${testInfo.file}`);

    await page.setContent(`
      <h1>Config Check: Retries</h1>
      <p id="retry">Retry attempt: ${testInfo.retry}</p>
    `);

    await expect(page.locator('h1')).toHaveText('Config Check: Retries');
    expect(testInfo.retry).toBe(0); // Should pass on first try
  });

  test('verify project name', async ({ page }) => {
    const testInfo = test.info();
    const projectName = testInfo.project.name;
    console.log(`Project name: ${projectName}`);

    await page.setContent(`
      <h1>Config Check: Project</h1>
      <p id="project">Project: ${projectName}</p>
    `);

    await expect(page.locator('#project')).toContainText(projectName);
  });

  test('full config summary', async ({ page }) => {
    const testInfo = test.info();

    await page.setContent(`
      <h1>Mission Config Summary</h1>
      <table style="border-collapse: collapse; width: 100%;">
        <tr style="border: 1px solid #ccc;">
          <td style="padding: 8px; font-weight: bold;">Test Title</td>
          <td style="padding: 8px;" id="title">${testInfo.title}</td>
        </tr>
        <tr style="border: 1px solid #ccc;">
          <td style="padding: 8px; font-weight: bold;">Timeout</td>
          <td style="padding: 8px;" id="timeout">${testInfo.timeout}ms</td>
        </tr>
        <tr style="border: 1px solid #ccc;">
          <td style="padding: 8px; font-weight: bold;">Retry</td>
          <td style="padding: 8px;" id="retry">${testInfo.retry}</td>
        </tr>
        <tr style="border: 1px solid #ccc;">
          <td style="padding: 8px; font-weight: bold;">Project</td>
          <td style="padding: 8px;" id="project">${testInfo.project.name}</td>
        </tr>
      </table>
    `);

    await expect(page.locator('h1')).toHaveText('Mission Config Summary');
    await expect(page.locator('#title')).toHaveText(testInfo.title);
    await expect(page.locator('#timeout')).toContainText('ms');
  });
});