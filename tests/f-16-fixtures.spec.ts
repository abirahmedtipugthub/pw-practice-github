// ============================================================
// F-16: Fixtures — Custom Supply Crates
// ============================================================
// CoD Campaign Analogy:
// Before every mission, HQ delivers SUPPLY CRATES to your team.
// Each crate has gear you need: weapons, ammo, radios, maps.
//
// Playwright does the SAME thing with "fixtures":
//   - 'page' = a supply crate containing a fresh browser page
//   - 'context' = a supply crate containing a browser context
//   - 'browser' = a supply crate containing the browser itself
//
// You've been using fixtures THIS WHOLE TIME!
// Every time you write: async ({ page }) =>
// You're saying: "Give me the 'page' supply crate"
//
// In F-16, you'll learn to create YOUR OWN supply crates:
//   - A crate that gives you a LOGGED-IN page
//   - A crate that gives you a PAGE WITH CONTENT already loaded
//   - A crate that gives you TEST DATA
//
// Why?
//   - Avoid repeating setup code in every test
//   - Keep tests clean — focus on the mission, not the prep
//   - Share setup across multiple test files
// ============================================================

// --- Load Playwright's test tools ---
// We import 'test' as 'base' because we'll EXTEND it
// to add our own custom fixtures.
// Think of it as: "take the standard-issue gear (base)
// and add our custom gear on top"
import { test as base, expect, Page } from '@playwright/test';

// ============================================================
// SECTION 1: Understanding Built-in Fixtures
// ============================================================
// These tests use the BUILT-IN fixtures you already know.
// This section just names them so you understand what they are.
//
// Built-in fixtures Playwright gives you:
//   page     = a fresh browser page (tab) — you use this the most
//   context  = the browser context (like a separate browser profile)
//   browser  = the browser itself (Chrome, Firefox, etc.)
//   request  = an API request context (for API testing)
// ============================================================

// --- Use 'base' here (which is just 'test' renamed) ---
base.describe('Section 1: Built-in Fixtures', () => {

  base('the page fixture gives us a fresh browser page', async ({ page }) => {
    // --- 'page' is a BUILT-IN fixture ---
    // Playwright creates a fresh page for EVERY test automatically.
    // After the test, it closes the page automatically too.
    // It's like HQ giving you a fresh map for each mission
    // and collecting it when you return.

    await page.setContent('<h1>Fresh Page</h1><p>This page was created by the page fixture</p>');
    await expect(page.locator('h1')).toHaveText('Fresh Page');
  });

  base('the context fixture gives us a browser context', async ({ context }) => {
    // --- 'context' is a BUILT-IN fixture ---
    // A context is like a SEPARATE browser profile.
    // It has its own cookies, storage, and settings.
    // You can create MULTIPLE pages from one context.
    // It's like having a separate identity for each mission.

    // Create a new page from the context
    const page = await context.newPage();
    await page.setContent('<h1>Page from Context</h1>');
    await expect(page.locator('h1')).toHaveText('Page from Context');

    // You could create another page in the same context
    const page2 = await context.newPage();
    await page2.setContent('<h1>Second Page</h1>');
    await expect(page2.locator('h1')).toHaveText('Second Page');
  });
});

// ============================================================
// SECTION 2: Creating Your First Custom Fixture
// ============================================================
// Now the real power: making YOUR OWN supply crates!
//
// To create a custom fixture:
//   1. Take the base 'test' (we renamed it to 'base')
//   2. Call base.extend({ ... }) to add your custom gear
//   3. Inside, define what each fixture provides
//   4. Use 'use' to hand the gear to the test
//
// The pattern:
//   const test = base.extend<{ myFixture: SomeType }>({
//     myFixture: async ({}, use) => {
//       // Setup: prepare the gear
//       const gear = createGear();
//       await use(gear);  // Hand it to the test
//       // Teardown: clean up after (optional)
//     }
//   });
// ============================================================

// --- Define types for our custom fixture ---
// This tells TypeScript what our fixture will provide
// It's like a manifest listing what's in the supply crate
type MissionData = {
  operatorName: string;
  missionCode: string;
  difficulty: string;
  weapons: string[];
};

// --- Create a custom test with our own fixture ---
// base.extend() takes the standard gear and adds our custom stuff
// <{ missionData: MissionData }> tells TypeScript the shape of our fixture
const testWithMission = base.extend<{ missionData: MissionData }>({

  // --- Our custom fixture: missionData ---
  // This is like a supply crate labeled "MISSION DATA"
  // Every test that asks for 'missionData' gets this data
  missionData: async ({}, use) => {
    // --- SETUP: Prepare the mission data ---
    // This runs BEFORE the test
    // It's like HQ preparing the mission briefing
    const data: MissionData = {
      operatorName: 'TIPU',
      missionCode: 'OP-FALCON-16',
      difficulty: 'Hard',
      weapons: ['M4A1', 'Glock 17', 'Frag Grenade'],
    };

    // --- HAND IT TO THE TEST ---
    // 'use(data)' gives the data to the test
    // The test pauses here until it's done
    // It's like delivering the crate to the soldier
    await use(data);

    // --- TEARDOWN: Clean up after the test ---
    // This runs AFTER the test finishes
    // It's like collecting the crate after the mission
    console.log(`[Fixture Teardown] Mission ${data.missionCode} data cleaned up`);
  },
});

// --- Now use our custom test instead of base ---
testWithMission.describe('Section 2: Custom Data Fixture', () => {

  testWithMission('should have access to mission data', async ({ page, missionData }) => {
    // --- We get BOTH the built-in 'page' AND our custom 'missionData' ---
    // page = from Playwright (built-in supply crate)
    // missionData = from our custom fixture (our supply crate)

    await page.setContent(`
      <h1>Mission Briefing</h1>
      <p id="operator">Operator: ${missionData.operatorName}</p>
      <p id="code">Code: ${missionData.missionCode}</p>
      <p id="difficulty">Difficulty: ${missionData.difficulty}</p>
    `);

    await expect(page.locator('#operator')).toContainText('TIPU');
    await expect(page.locator('#code')).toContainText('OP-FALCON-16');
    await expect(page.locator('#difficulty')).toContainText('Hard');
  });

  testWithMission('should have weapons list', async ({ page, missionData }) => {
    // --- Same fixture, different test —
    // Each test gets a FRESH copy of the fixture data
    // It's like getting a NEW supply crate for each mission

    // Build a list of weapons on the page
    const weaponItems = missionData.weapons
      .map((w) => `<li class="weapon">${w}</li>`)
      .join('');

    await page.setContent(`
      <h1>Weapon Inventory</h1>
      <ul id="weapons">${weaponItems}</ul>
    `);

    // Check all weapons are listed
    await expect(page.locator('.weapon')).toHaveCount(3);
    await expect(page.getByText('M4A1')).toBeVisible();
    await expect(page.getByText('Glock 17')).toBeVisible();
    await expect(page.getByText('Frag Grenade')).toBeVisible();
  });
});

// ============================================================
// SECTION 3: Page-Based Fixture — Pre-Loaded Pages
// ============================================================
// The REAL power of fixtures: giving tests a page that's
// ALREADY SET UP. No more repeating page.setContent() or
// page.goto() in every test!
//
// CoD Analogy: Instead of building the base from scratch
// before every mission, HQ drops you into a base that's
// ALREADY BUILT. Just start your mission!
// ============================================================

// --- Custom fixture that gives a PRE-LOADED page ---
const testWithForm = base.extend<{ formPage: Page }>({

  // This fixture depends on 'page' (a built-in fixture)
  // It takes the page, sets it up, then hands the ready page to the test
  formPage: async ({ page }, use) => {
    // --- SETUP: Build the form BEFORE the test starts ---
    await page.setContent(`
      <h1>Operator Registration</h1>
      <form id="reg-form">
        <label for="callsign">Callsign:</label>
        <input id="callsign" type="text" placeholder="Enter callsign" />

        <label for="rank">Rank:</label>
        <select id="rank">
          <option value="">-- Select Rank --</option>
          <option value="private">Private</option>
          <option value="corporal">Corporal</option>
          <option value="sergeant">Sergeant</option>
          <option value="captain">Captain</option>
        </select>

        <label for="specialization">Specialization:</label>
        <select id="specialization">
          <option value="">-- Select --</option>
          <option value="assault">Assault</option>
          <option value="recon">Recon</option>
          <option value="support">Support</option>
          <option value="sniper">Sniper</option>
        </select>

        <label><input type="checkbox" id="active" /> Active Duty</label>
        <button type="button" id="register-btn">Register</button>
        <div id="result"></div>
      </form>
      <script>
        document.getElementById('register-btn').addEventListener('click', () => {
          const callsign = document.getElementById('callsign').value;
          const rank = document.getElementById('rank').value;
          const spec = document.getElementById('specialization').value;
          const active = document.getElementById('active').checked;
          let msg = callsign + ' | ' + rank + ' | ' + spec;
          if (active) msg += ' | ACTIVE';
          document.getElementById('result').textContent = msg;
        });
      </script>
    `);

    // --- Hand the READY page to the test ---
    // The test receives a page that already has the form loaded
    // No setup needed inside the test!
    await use(page);

    // --- TEARDOWN ---
    console.log('[Fixture] Registration form page cleaned up');
  },
});

testWithForm.describe('Section 3: Page Fixture — Pre-Loaded Form', () => {

  testWithForm('should display the registration form', async ({ formPage }) => {
    // --- The form is ALREADY loaded! No setup needed! ---
    // formPage = a page with the registration form ready to use
    // It's like being dropped into a ready-made command center
    await expect(formPage.locator('h1')).toHaveText('Operator Registration');
    await expect(formPage.locator('#callsign')).toBeVisible();
    await expect(formPage.locator('#rank')).toBeVisible();
    await expect(formPage.locator('#register-btn')).toBeVisible();
  });

  testWithForm('should register an assault captain', async ({ formPage }) => {
    // --- Just fill and submit — the form is already there ---
    await formPage.locator('#callsign').fill('GHOST');
    await formPage.locator('#rank').selectOption('captain');
    await formPage.locator('#specialization').selectOption('assault');
    await formPage.locator('#active').check();
    await formPage.locator('#register-btn').click();

    await expect(formPage.locator('#result')).toContainText('GHOST | captain | assault | ACTIVE');
  });

  testWithForm('should register a recon private', async ({ formPage }) => {
    await formPage.locator('#callsign').fill('SHADOW');
    await formPage.locator('#rank').selectOption('private');
    await formPage.locator('#specialization').selectOption('recon');
    // NOT checking active duty
    await formPage.locator('#register-btn').click();

    await expect(formPage.locator('#result')).toContainText('SHADOW | private | recon');
    // Should NOT contain ACTIVE since we didn't check the box
    await expect(formPage.locator('#result')).not.toContainText('ACTIVE');
  });

  testWithForm('should register a support sergeant on active duty', async ({ formPage }) => {
    await formPage.locator('#callsign').fill('MEDIC');
    await formPage.locator('#rank').selectOption('sergeant');
    await formPage.locator('#specialization').selectOption('support');
    await formPage.locator('#active').check();
    await formPage.locator('#register-btn').click();

    await expect(formPage.locator('#result')).toContainText('MEDIC | sergeant | support | ACTIVE');
  });
});

// ============================================================
// SECTION 4: Multiple Fixtures — Multiple Supply Crates
// ============================================================
// You can create MULTIPLE fixtures at once.
// Each test can request whichever ones it needs.
// It's like ordering different supply crates:
//   "I need the DATA crate, the COMMS crate, and the MAP crate"
// ============================================================

// --- Define types for multiple fixtures ---
type OperatorInfo = {
  name: string;
  rank: string;
  team: string;
};

type MissionConfig = {
  location: string;
  objective: string;
  timeLimit: string;
};

// --- Create test with MULTIPLE custom fixtures ---
const testWithMultiple = base.extend<{
  operator: OperatorInfo;
  missionConfig: MissionConfig;
  dashboardPage: Page;
}>({

  // --- Fixture 1: Operator Info ---
  operator: async ({}, use) => {
    await use({
      name: 'TIPU',
      rank: 'Captain',
      team: 'Alpha Squad',
    });
  },

  // --- Fixture 2: Mission Config ---
  missionConfig: async ({}, use) => {
    await use({
      location: 'Sector 7-G',
      objective: 'Secure the intel package',
      timeLimit: '45 minutes',
    });
  },

  // --- Fixture 3: Dashboard Page (depends on page + other fixtures) ---
  dashboardPage: async ({ page, operator, missionConfig }, use) => {
    // This fixture uses OTHER fixtures!
    // 'operator' and 'missionConfig' are available because
    // Playwright resolves fixture dependencies automatically.
    // It's like a supply crate that's assembled from parts
    // of other crates.
    await page.setContent(`
      <h1>Mission Dashboard</h1>
      <div id="operator-info">
        <span id="op-name">${operator.name}</span> |
        <span id="op-rank">${operator.rank}</span> |
        <span id="op-team">${operator.team}</span>
      </div>
      <div id="mission-info">
        <span id="location">${missionConfig.location}</span> |
        <span id="objective">${missionConfig.objective}</span> |
        <span id="time-limit">${missionConfig.timeLimit}</span>
      </div>
      <button id="start-btn">Start Mission</button>
      <div id="status"></div>
      <script>
        document.getElementById('start-btn').addEventListener('click', () => {
          document.getElementById('status').textContent = 'MISSION IN PROGRESS';
        });
      </script>
    `);

    await use(page);
  },
});

testWithMultiple.describe('Section 4: Multiple Fixtures', () => {

  testWithMultiple('should show operator info on dashboard', async ({ dashboardPage, operator }) => {
    // dashboardPage already has the dashboard loaded!
    // operator has the data we can verify against
    await expect(dashboardPage.locator('#op-name')).toHaveText(operator.name);
    await expect(dashboardPage.locator('#op-rank')).toHaveText(operator.rank);
    await expect(dashboardPage.locator('#op-team')).toHaveText(operator.team);
  });

  testWithMultiple('should show mission config on dashboard', async ({ dashboardPage, missionConfig }) => {
    await expect(dashboardPage.locator('#location')).toHaveText(missionConfig.location);
    await expect(dashboardPage.locator('#objective')).toHaveText(missionConfig.objective);
    await expect(dashboardPage.locator('#time-limit')).toHaveText(missionConfig.timeLimit);
  });

  testWithMultiple('should start the mission', async ({ dashboardPage }) => {
    await dashboardPage.locator('#start-btn').click();
    await expect(dashboardPage.locator('#status')).toHaveText('MISSION IN PROGRESS');
  });

  testWithMultiple('can use just the operator fixture without the page', async ({ operator }) => {
    // You don't HAVE to use every fixture!
    // Here we only need operator data, no page needed
    // It's like requesting just the intel crate, no weapons
    expect(operator.name).toBe('TIPU');
    expect(operator.rank).toBe('Captain');
    expect(operator.team).toBe('Alpha Squad');
  });
});

// ============================================================
// SECTION 5: Real Mission — Login Fixture
// ============================================================
// The most USEFUL fixture in real projects:
// A page that's ALREADY LOGGED IN.
// Instead of typing username/password in every test,
// the fixture does it for you!
//
// CoD Analogy: Instead of going through the same checkpoint
// security process before every mission, you get a VIP pass.
// The fixture IS that VIP pass.
// ============================================================

const testWithLogin = base.extend<{ loggedInPage: Page }>({

  loggedInPage: async ({ page }, use) => {
    // --- SETUP: Log in before the test ---
    // 1. Go to the login page
    await page.goto('https://the-internet.herokuapp.com/login');

    // 2. Fill in credentials
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');

    // 3. Click login
    await page.locator('button[type="submit"]').click();

    // 4. Wait for navigation to the secure area
    await page.waitForURL('**/secure');

    // 5. Verify login succeeded before handing to the test
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');

    // --- Hand the LOGGED-IN page to the test ---
    // The test starts ALREADY LOGGED IN!
    await use(page);

    // --- TEARDOWN: Log out after the test ---
    console.log('[Fixture] Logging out...');
  },
});

testWithLogin.describe('Section 5: Login Fixture — Real Mission', () => {

  testWithLogin('should already be on the secure page', async ({ loggedInPage }) => {
    // --- We're ALREADY logged in! The fixture did it! ---
    // No page.goto(), no fill(), no click() — just verify!
    await expect(loggedInPage).toHaveURL(/secure/);
  });

  testWithLogin('should see the secure area content', async ({ loggedInPage }) => {
    // --- Already logged in — just check the content ---
        await expect(loggedInPage.getByRole('heading', { name: 'Secure Area', exact: true })).toBeVisible();
  });

  testWithLogin('should have a logout button', async ({ loggedInPage }) => {
    // --- Already logged in — check for logout ---
    const logoutBtn = loggedInPage.locator('a[href="/logout"]');
    await expect(logoutBtn).toBeVisible();
  });

  testWithLogin('should be able to log out', async ({ loggedInPage }) => {
    // --- Start logged in, then log out ---
    await loggedInPage.locator('a[href="/logout"]').click();
    await loggedInPage.waitForURL('**/login');
    await expect(loggedInPage).toHaveURL(/login/);
  });
});