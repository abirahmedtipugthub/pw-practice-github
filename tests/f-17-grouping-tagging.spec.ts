// ============================================================
// F-17: Grouping & Tagging Tests
// ============================================================
// CoD Campaign Analogy:
// You have HUNDREDS of missions. You can't run them all every day.
// So you organize them:
//
//   @smoke    = Quick checkpoint missions (run these FIRST, fast)
//   @regression = Full campaign missions (run ALL of them)
//   @critical = Must-pass missions (if these fail, STOP everything)
//   @slow     = Long missions that take extra time
//
// Playwright lets you TAG tests with @annotations.
// Then you can run ONLY the tagged tests:
//   npx playwright test --grep @smoke     → run only smoke tests
//   npx playwright test --grep @critical  → run only critical tests
//   npx playwright test --grep-invert @slow → run everything EXCEPT slow
//
// You can also GROUP tests with test.describe() — you already
// know this from F-15! Now we combine grouping WITH tagging.
// ============================================================

import { test, expect } from '@playwright/test';

// ============================================================
// SECTION 1: Basic Tagging with @tags in Test Names
// ============================================================
// The simplest way to tag: put @tagname in the test title.
// Then use --grep to filter when running.
//
// Run commands:
//   npx playwright test tests/f-17-grouping-tagging.spec.ts --grep @smoke
//   npx playwright test tests/f-17-grouping-tagging.spec.ts --grep @critical
// ============================================================

test('@smoke should load the homepage', async ({ page }) => {
  // --- A quick "smoke test" — just check the page loads ---
  // Smoke tests are like a quick radio check before a mission:
  //   "Base, this is Alpha. Radio check, over."
  //   "Copy that, Alpha. Loud and clear."
  // If the radio check fails, cancel the mission!
  await page.setContent('<h1>Welcome to HQ</h1>');
  await expect(page.locator('h1')).toHaveText('Welcome to HQ');
});

test('@smoke should display navigation links', async ({ page }) => {
  // --- Another quick check — are the nav links there? ---
  await page.setContent(`
    <nav>
      <a href="/missions">Missions</a>
      <a href="/inventory">Inventory</a>
      <a href="/intel">Intel</a>
    </nav>
  `);

  await expect(page.locator('nav a')).toHaveCount(3);
});

test('@critical should login successfully', async ({ page }) => {
  // --- Critical test — if login breaks, EVERYTHING is broken ---
  // Critical tests are like mission-essential objectives:
  //   "If we can't secure the bridge, the entire operation fails."
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.locator('#username').fill('tomsmith');
  await page.locator('#password').fill('SuperSecretPassword!');
  await page.locator('button[type="submit"]').click();

  await page.waitForURL('**/secure');
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});

test('@critical should show error on invalid login', async ({ page }) => {
  // --- Another critical test — error handling must work ---
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.locator('#username').fill('wrong');
  await page.locator('#password').fill('wrong');
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('#flash')).toContainText('Your username is invalid!');
});

test('@regression should verify all form fields exist', async ({ page }) => {
  // --- Regression test — check that nothing is broken ---
  // Regression tests re-check old features after new changes.
  // Like inspecting the entire base after construction work:
  //   "Did the renovation break anything that used to work?"
  await page.setContent(`
    <form id="mission-form">
      <input id="name" type="text" placeholder="Operator Name" />
      <input id="email" type="email" placeholder="Email" />
      <input id="code" type="text" placeholder="Mission Code" />
      <select id="priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <textarea id="notes" placeholder="Notes"></textarea>
      <button type="submit">Submit</button>
    </form>
  `);

  await expect(page.locator('#name')).toBeVisible();
  await expect(page.locator('#email')).toBeVisible();
  await expect(page.locator('#code')).toBeVisible();
  await expect(page.locator('#priority')).toBeVisible();
  await expect(page.locator('#notes')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

// ============================================================
// SECTION 2: Grouping with describe + Tags
// ============================================================
// Combine describe() groups with @tags for organized tests.
// The group name can ALSO contain tags!
// ============================================================

test.describe('@smoke Navigation Tests', () => {
  // --- All tests in this group are smoke tests ---
  // The @smoke tag is in the describe name

  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <nav id="main-nav">
        <a href="/home" class="nav-link">Home</a>
        <a href="/missions" class="nav-link">Missions</a>
        <a href="/armory" class="nav-link">Armory</a>
        <a href="/intel" class="nav-link">Intel</a>
        <a href="/profile" class="nav-link">Profile</a>
      </nav>
      <div id="content">Main Content Area</div>
    `);
  });

  test('should have 5 navigation links', async ({ page }) => {
    await expect(page.locator('.nav-link')).toHaveCount(5);
  });

  test('should have Home link', async ({ page }) => {
    await expect(page.getByText('Home')).toBeVisible();
  });

  test('should have Missions link', async ({ page }) => {
    await expect(page.getByText('Missions')).toBeVisible();
  });

  test('should display main content area', async ({ page }) => {
    await expect(page.locator('#content')).toHaveText('Main Content Area');
  });
});

// ============================================================
// SECTION 3: Multiple Tags on One Test
// ============================================================
// A test can have MORE THAN ONE tag!
// Like a mission that's both "critical" AND "smoke".
// ============================================================

test('@smoke @critical should display the app title', async ({ page }) => {
  // --- This test has TWO tags: @smoke AND @critical ---
  // It will run when you grep for EITHER tag:
  //   --grep @smoke → YES, this runs
  //   --grep @critical → YES, this runs too
  await page.setContent('<h1 id="app-title">Mission Control v2.0</h1>');
  await expect(page.locator('#app-title')).toHaveText('Mission Control v2.0');
});

test('@regression @slow should verify entire dashboard loads', async ({ page }) => {
  // --- Tagged as both regression AND slow ---
  // You could SKIP slow tests with: --grep-invert @slow
  await page.setContent(`
    <h1>Mission Dashboard</h1>
    <div id="stats">
      <div class="stat" id="total-missions">Total: 150</div>
      <div class="stat" id="completed">Completed: 120</div>
      <div class="stat" id="pending">Pending: 25</div>
      <div class="stat" id="failed">Failed: 5</div>
    </div>
    <div id="chart">Chart Area</div>
    <div id="recent-activity">Recent Activity Log</div>
  `);

  await expect(page.locator('h1')).toHaveText('Mission Dashboard');
  await expect(page.locator('.stat')).toHaveCount(4);
  await expect(page.locator('#total-missions')).toContainText('150');
  await expect(page.locator('#completed')).toContainText('120');
  await expect(page.locator('#pending')).toContainText('25');
  await expect(page.locator('#failed')).toContainText('5');
  await expect(page.locator('#chart')).toBeVisible();
  await expect(page.locator('#recent-activity')).toBeVisible();
});

// ============================================================
// SECTION 4: test.describe.configure — Serial vs Parallel
// ============================================================
// By default, tests run in PARALLEL (multiple at once).
// Sometimes you need tests to run in ORDER (serial).
//
// CoD Analogy:
//   Parallel = multiple fire teams hitting different targets
//              at the SAME TIME (faster, but independent)
//   Serial   = one team clearing rooms ONE BY ONE in ORDER
//              (slower, but each step depends on the last)
// ============================================================

test.describe('Serial Mission — Room Clearing', () => {
  // --- Force tests to run in ORDER, one after another ---
  // If one fails, the rest are SKIPPED (like aborting a mission)
  test.describe.configure({ mode: 'serial' });

  test('@critical Step 1: Breach the door', async ({ page }) => {
    await page.setContent('<div id="door" class="locked">Door: LOCKED</div>');
    await expect(page.locator('#door')).toHaveText('Door: LOCKED');
    // In a real test, this might set up state for the next test
  });

  test('@critical Step 2: Clear the room', async ({ page }) => {
    await page.setContent(`
      <div id="room" class="clearing">
        <div class="hostile" id="hostile-1">Hostile 1: NEUTRALIZED</div>
        <div class="hostile" id="hostile-2">Hostile 2: NEUTRALIZED</div>
      </div>
    `);
    await expect(page.locator('.hostile')).toHaveCount(2);
  });

  test('@critical Step 3: Secure the intel', async ({ page }) => {
    await page.setContent(`
      <div id="intel-room">
        <div id="intel" class="secured">Intel Package: SECURED</div>
        <div id="mission-status">STATUS: COMPLETE</div>
      </div>
    `);
    await expect(page.locator('#intel')).toContainText('SECURED');
    await expect(page.locator('#mission-status')).toHaveText('STATUS: COMPLETE');
  });
});

// ============================================================
// SECTION 5: test.skip, test.fixme, test.only — Mission Status
// ============================================================
// test.skip()  = "Skip this mission" (maybe it's broken right now)
// test.fixme() = "This mission needs fixing" (known issue, skip it)
// test.only()  = "Run ONLY this mission" (for debugging one test)
//
// CoD Analogy:
//   skip  = "That area is too hot. Skip it for now."
//   fixme = "Our intel is wrong on this one. Mark it for review."
//   only  = "Focus ALL resources on THIS ONE mission."
//
// WARNING: NEVER commit test.only() — it makes CI run just
// one test and skip everything else! Use it only for debugging.
// ============================================================

test.describe('Mission Status Controls', () => {

  test('active mission — this runs normally', async ({ page }) => {
    await page.setContent('<h1>Active Mission</h1>');
    await expect(page.locator('h1')).toHaveText('Active Mission');
  });

  // --- test.skip() — this test will NOT run ---
  // The test still appears in the report as "skipped"
  // Use when: the feature isn't built yet, or a bug is blocking it
  test.skip('skipped mission — this does NOT run', async ({ page }) => {
    // This code never executes
    await page.setContent('<h1>Skipped</h1>');
    await expect(page.locator('h1')).toHaveText('Skipped');
  });

  // --- test.fixme() — same as skip, but means "needs fixing" ---
  // Use when: you KNOW this test has a bug and you'll fix it later
  test.fixme('fixme mission — known issue, needs repair', async ({ page }) => {
    // This code never executes
    await page.setContent('<h1>Fixme</h1>');
    await expect(page.locator('h1')).toHaveText('Fixme');
  });

  // --- test.only() is shown but COMMENTED OUT ---
  // NEVER commit test.only() — it breaks CI/CD!
  // Uncomment ONLY when debugging locally, then re-comment.
  //
  // test.only('debug mission — ONLY this test runs', async ({ page }) => {
  //   await page.setContent('<h1>Debug Only</h1>');
  //   await expect(page.locator('h1')).toHaveText('Debug Only');
  // });
});

// ============================================================
// SECTION 6: Conditional Skip — Skip Based on Conditions
// ============================================================
// Sometimes you want to skip a test only in certain situations.
// Like: "Skip this mission if we're on the training map"
// ============================================================

test.describe('Conditional Skip Tests', () => {

  test('skip on a condition — platform check', async ({ page, browserName }) => {
    // --- Skip this test if running on Firefox ---
    // browserName is a built-in fixture that tells you which browser
    // 'chromium', 'firefox', or 'webkit'
    test.skip(browserName === 'firefox', 'This test is only for Chromium');

    await page.setContent('<h1>Chromium Only</h1>');
    await expect(page.locator('h1')).toHaveText('Chromium Only');
  });

  test('skip with a reason', async ({ page }) => {
    // --- You can skip INSIDE a test with a reason ---
    // The reason shows up in the test report
    const featureEnabled = false;

    // Skip if the feature flag is off
    test.skip(!featureEnabled, 'Feature not yet deployed — skipping');

    // This code only runs if featureEnabled is true
    await page.setContent('<h1>New Feature</h1>');
    await expect(page.locator('h1')).toHaveText('New Feature');
  });
});

// ============================================================
// SECTION 7: test.info().annotations — Custom Annotations
// ============================================================
// You can add CUSTOM information to your test reports.
// This shows up in the HTML report.
// Like adding notes to your mission debrief.
// ============================================================

test.describe('@regression Report Annotations', () => {

  test('annotated test — with custom info', async ({ page }) => {
    // --- Add custom annotations to the test ---
    // These appear in the Playwright HTML report
    test.info().annotations.push({
      type: 'issue',
      description: 'Related to ticket MISSION-42',
    });

    test.info().annotations.push({
      type: 'owner',
      description: 'TIPU',
    });

    await page.setContent(`
      <h1>Annotated Mission</h1>
      <p id="ticket">MISSION-42</p>
      <p id="owner">Owner: TIPU</p>
    `);

    await expect(page.locator('#ticket')).toHaveText('MISSION-42');
    await expect(page.locator('#owner')).toContainText('TIPU');
  });

  test('another annotated test', async ({ page }) => {
    test.info().annotations.push({
      type: 'priority',
      description: 'HIGH — must pass before deployment',
    });

    await page.setContent('<h1>High Priority Mission</h1>');
    await expect(page.locator('h1')).toHaveText('High Priority Mission');
  });
});

// ============================================================
// SECTION 8: Real Mission — Full Tagging Strategy
// ============================================================
// A complete example showing how a real project organizes tests.
// ============================================================

test.describe('@smoke @critical Core App Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <div id="app">
        <header>
          <h1>Operator Command Center</h1>
          <span id="user">TIPU</span>
          <button id="logout">Logout</button>
        </header>
        <main>
          <div id="mission-list">
            <div class="mission" data-status="active">Mission Alpha — Active</div>
            <div class="mission" data-status="completed">Mission Bravo — Completed</div>
            <div class="mission" data-status="active">Mission Charlie — Active</div>
          </div>
          <div id="quick-stats">
            <span id="active-count">Active: 2</span>
            <span id="complete-count">Completed: 1</span>
          </div>
        </main>
      </div>
    `);
  });

  test('should display app header', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Operator Command Center');
    await expect(page.locator('#user')).toHaveText('TIPU');
    await expect(page.locator('#logout')).toBeVisible();
  });

  test('should list all missions', async ({ page }) => {
    await expect(page.locator('.mission')).toHaveCount(3);
  });

  test('should show correct active count', async ({ page }) => {
    const activeMissions = page.locator('.mission[data-status="active"]');
    await expect(activeMissions).toHaveCount(2);
    await expect(page.locator('#active-count')).toHaveText('Active: 2');
  });

  test('should show correct completed count', async ({ page }) => {
    const completedMissions = page.locator('.mission[data-status="completed"]');
    await expect(completedMissions).toHaveCount(1);
    await expect(page.locator('#complete-count')).toHaveText('Completed: 1');
  });
});