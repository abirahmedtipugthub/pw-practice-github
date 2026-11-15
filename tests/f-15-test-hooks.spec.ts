// ============================================================
// F-15: Test Hooks — Pre-Mission & Post-Mission Routines
// ============================================================
// CoD Campaign Analogy:
// Before EVERY mission, soldiers follow a routine:
//   - Check gear, load weapons, review briefing
// After EVERY mission, soldiers follow another routine:
//   - Clean weapons, file report, restock ammo
//
// Playwright has the SAME concept — "hooks":
//   beforeEach() = runs BEFORE every single test
//   afterEach()  = runs AFTER every single test
//   beforeAll()  = runs ONCE before ALL tests start
//   afterAll()   = runs ONCE after ALL tests finish
//
// Why use hooks?
//   - Avoid repeating the same setup in every test
//   - Keep tests clean and focused
//   - Set up and tear down shared resources
//
// Think of it like this:
//   beforeAll  = base setup (runs once when the day starts)
//   beforeEach = pre-mission gear check (runs before each mission)
//   TEST       = the actual mission
//   afterEach  = post-mission cleanup (runs after each mission)
//   afterAll   = base shutdown (runs once when the day ends)
// ============================================================

// --- Load Playwright's test tools ---
import { test, expect } from '@playwright/test';

// ============================================================
// SECTION 1: beforeEach — Pre-Mission Routine
// ============================================================
// test.describe() groups related tests together.
// Think of it as a MISSION FOLDER — all missions inside share
// the same pre-mission and post-mission routines.
// ============================================================

test.describe('Login Page Tests — using beforeEach', () => {

  // --- This runs BEFORE EVERY test in this group ---
  // Every test below will start on the login page
  // without needing to write page.goto() in each test
  // It's like: "Before every mission, go to the staging area"
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    // This way, every test starts from the same place
    await page.goto('https://the-internet.herokuapp.com/login');
  });

  test('should show the login heading', async ({ page }) => {
    // --- We're already on the login page (beforeEach did that) ---
    // No need for page.goto() here — the hook handled it!
    await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();
  });

  test('should have username and password fields', async ({ page }) => {
    // --- Again, we're already on the login page ---
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('should have a login button', async ({ page }) => {
    // --- Already on the login page ---
    const loginBtn = page.locator('button[type="submit"]');
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
  });

  test('should login with valid credentials', async ({ page }) => {
    // --- Already on the login page ---
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/secure');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
  });
});

// ============================================================
// SECTION 2: afterEach — Post-Mission Routine
// ============================================================
// afterEach runs AFTER every test finishes.
// Use it for cleanup, logging, or resetting state.
// ============================================================

test.describe('Form Tests — using beforeEach and afterEach', () => {

  // --- Before each test: set up the form page ---
  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <h1>Mission Report Form</h1>
      <form id="report-form">
        <label for="operator">Operator:</label>
        <input id="operator" type="text" />
        <label for="status">Mission Status:</label>
        <select id="status">
          <option value="">-- Select --</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="aborted">Aborted</option>
        </select>
        <label><input type="checkbox" id="injuries" /> Injuries Reported</label>
        <button type="button" id="submit-btn">Submit Report</button>
        <div id="result"></div>
      </form>
      <script>
        document.getElementById('submit-btn').addEventListener('click', () => {
          const name = document.getElementById('operator').value;
          const status = document.getElementById('status').value;
          const injuries = document.getElementById('injuries').checked;
          let msg = name + ': ' + status;
          if (injuries) msg += ' (injuries reported)';
          document.getElementById('result').textContent = msg;
        });
      </script>
    `);
  });

  // --- After each test: log that the test finished ---
  // In real projects, afterEach might:
  //   - Take a screenshot
  //   - Save logs
  //   - Clear cookies
  //   - Reset the database
  test.afterEach(async ({ page }) => {
    // Log the current page title after each test
    // This is just for demonstration — in real projects you'd do more
    const title = await page.title();
    console.log(`[Post-Mission Cleanup] Page title: "${title}"`);
  });

  test('should fill and submit a success report', async ({ page }) => {
    await page.locator('#operator').fill('TIPU');
    await page.locator('#status').selectOption('success');
    await page.locator('#submit-btn').click();

    await expect(page.locator('#result')).toContainText('TIPU: success');
  });

  test('should fill and submit a failed report with injuries', async ({ page }) => {
    await page.locator('#operator').fill('GHOST');
    await page.locator('#status').selectOption('failed');
    await page.locator('#injuries').check();
    await page.locator('#submit-btn').click();

    await expect(page.locator('#result')).toContainText('GHOST: failed (injuries reported)');
  });

  test('should fill and submit an aborted report', async ({ page }) => {
    await page.locator('#operator').fill('PRICE');
    await page.locator('#status').selectOption('aborted');
    await page.locator('#submit-btn').click();

    await expect(page.locator('#result')).toContainText('PRICE: aborted');
  });
});

// ============================================================
// SECTION 3: beforeAll and afterAll — Base Setup & Shutdown
// ============================================================
// beforeAll runs ONCE before any test starts.
// afterAll runs ONCE after all tests finish.
// These are for things you only need to do ONE TIME.
//
// CoD Analogy:
//   beforeAll = "Set up the forward operating base" (once)
//   beforeEach = "Gear up for this specific mission" (every time)
//   TEST = "Execute the mission"
//   afterEach = "Debrief after this mission" (every time)
//   afterAll = "Pack up the base and go home" (once)
// ============================================================

test.describe('Mission Log — using all four hooks', () => {

  // This variable is shared across all tests in this group
  // It's like a mission log book that everyone writes in
  let missionLog: string[] = [];

  // --- Runs ONCE before ALL tests ---
  // Set up the log book
  test.beforeAll(() => {
    missionLog = [];
    missionLog.push('=== BASE ESTABLISHED ===');
    console.log('[beforeAll] Forward Operating Base is set up');
  });

  // --- Runs BEFORE EACH test ---
  test.beforeEach(() => {
    missionLog.push('--- Gearing up for mission ---');
    console.log('[beforeEach] Operator is gearing up');
  });

  // --- Runs AFTER EACH test ---
  test.afterEach(() => {
    missionLog.push('--- Mission debrief complete ---');
    console.log('[afterEach] Debrief complete');
  });

  // --- Runs ONCE after ALL tests ---
  test.afterAll(() => {
    missionLog.push('=== BASE PACKED UP ===');
    console.log('[afterAll] Base is packed up. Full log:');
    // Print the entire mission log
    missionLog.forEach((entry) => console.log('  ' + entry));
  });

  test('Mission Alpha', async ({ page }) => {
    missionLog.push('Mission Alpha: COMPLETED');

    await page.setContent('<h1>Mission Alpha</h1>');
    await expect(page.locator('h1')).toHaveText('Mission Alpha');
  });

  test('Mission Bravo', async ({ page }) => {
    missionLog.push('Mission Bravo: COMPLETED');

    await page.setContent('<h1>Mission Bravo</h1>');
    await expect(page.locator('h1')).toHaveText('Mission Bravo');
  });

  test('Mission Charlie', async ({ page }) => {
    missionLog.push('Mission Charlie: COMPLETED');

    await page.setContent('<h1>Mission Charlie</h1>');
    await expect(page.locator('h1')).toHaveText('Mission Charlie');
  });
});

// ============================================================
// SECTION 4: Nested describe — Groups Within Groups
// ============================================================
// You can put describe() INSIDE another describe().
// Each level can have its own hooks.
// CoD Analogy: A main campaign with multiple chapters,
// and each chapter has its own missions.
// ============================================================

test.describe('Weapon Inventory App', () => {

  // --- Shared setup for ALL tests in this group ---
  test.beforeEach(async ({ page }) => {
    // Set up the inventory page before each test
    await page.setContent(`
      <h1>Weapon Inventory</h1>
      <div id="inventory">
        <div class="weapon" data-type="rifle">AK-47 — Assault Rifle</div>
        <div class="weapon" data-type="rifle">M4A1 — Assault Rifle</div>
        <div class="weapon" data-type="smg">MP5 — Submachine Gun</div>
        <div class="weapon" data-type="sniper">AWP — Sniper Rifle</div>
        <div class="weapon" data-type="pistol">Desert Eagle — Pistol</div>
      </div>
      <div id="count"></div>
      <script>
        const count = document.querySelectorAll('.weapon').length;
        document.getElementById('count').textContent = 'Total weapons: ' + count;
      </script>
    `);
  });

  // --- These tests use the shared setup ---
  test('should display the inventory heading', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Weapon Inventory');
  });

  test('should have 5 weapons total', async ({ page }) => {
    await expect(page.locator('.weapon')).toHaveCount(5);
    await expect(page.locator('#count')).toHaveText('Total weapons: 5');
  });

  // --- NESTED GROUP: Tests specifically for rifles ---
  test.describe('Rifles', () => {

    test('should have 2 rifles', async ({ page }) => {
      // Find weapons where data-type is "rifle"
      const rifles = page.locator('.weapon[data-type="rifle"]');
      await expect(rifles).toHaveCount(2);
    });

    test('should include AK-47', async ({ page }) => {
      await expect(page.getByText('AK-47')).toBeVisible();
    });

    test('should include M4A1', async ({ page }) => {
      await expect(page.getByText('M4A1')).toBeVisible();
    });
  });

  // --- NESTED GROUP: Tests for other weapon types ---
  test.describe('Other Weapons', () => {

    test('should have 1 SMG', async ({ page }) => {
      const smgs = page.locator('.weapon[data-type="smg"]');
      await expect(smgs).toHaveCount(1);
    });

    test('should have 1 sniper rifle', async ({ page }) => {
      const snipers = page.locator('.weapon[data-type="sniper"]');
      await expect(snipers).toHaveCount(1);
    });

    test('should have 1 pistol', async ({ page }) => {
      const pistols = page.locator('.weapon[data-type="pistol"]');
      await expect(pistols).toHaveCount(1);
    });
  });
});

// ============================================================
// SECTION 5: Real Mission — Login Tests with Full Hook Setup
// ============================================================
// A complete, production-style test group using hooks properly.
// ============================================================

test.describe('Secure Area — Full Hook Demo', () => {

  // --- Before each test: go to the login page ---
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    // Verify the page loaded correctly
    await expect(page.locator('#username')).toBeVisible();
  });

  // --- After each test: log the final URL ---
  test.afterEach(async ({ page }) => {
    const url = page.url();
    console.log(`[After Test] Final URL: ${url}`);
  });

  test('valid login should redirect to secure area', async ({ page }) => {
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL('**/secure');
    await expect(page).toHaveURL(/secure/);
  });

  test('invalid login should stay on login page', async ({ page }) => {
    await page.locator('#username').fill('wronguser');
    await page.locator('#password').fill('wrongpass');
    await page.locator('button[type="submit"]').click();

    // Should still be on the login page
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('#flash')).toContainText('Your username is invalid!');
  });

  test('empty fields should show error', async ({ page }) => {
    // Click login without filling anything
    await page.locator('button[type="submit"]').click();

    // Should show an error
    await expect(page).toHaveURL(/login/);
    await expect(page.locator('#flash')).toBeVisible();
  });
});