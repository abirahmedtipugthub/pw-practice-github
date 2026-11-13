// CoD Analogy: F-09/F-10 = SPOT the target. F-11 = ENGAGE. F-12 = VERIFY the kill — did it actually work?

// Here’s the breakdown:

// Test 1 — toBeVisible() / toBeHidden() — can you see it?
// Test 2 — toHaveText() / toContainText() — reading intel (exact vs partial match)
// Test 3 — toHaveValue() — what’s loaded in an input field?
// Test 4 — toHaveAttribute() — inspecting element specs (href, type, alt)
// Test 5 — toBeEnabled() / toBeDisabled() — is the button locked or usable?
// Test 6 — toBeChecked() — is the switch ON or OFF?
// Test 7 — toHaveCount() — counting elements (“how many enemies in the room?”)
// Test 8 — toHaveURL() / toHaveTitle() — verifying you’re at the right location
// Test 9 — toHaveCSS() — checking visual styles (color, size, bold)
// Test 10 — .not — flipping any assertion to check the OPPOSITE
// Test 11 — expect.soft() — soft assertions (keep going after a failure)
// Test 12 — Real mission — full page verification on a live login page

// ============================================================
// F-12: Assertions & Expectations — Intel Verification
// ============================================================
// CoD Campaign Analogy:
// After every mission, you VERIFY the intel:
//   "Did we hit the right target?"
//   "Is the building destroyed?"
//   "Did the hostage survive?"
// In Playwright, expect() is your INTEL VERIFIER.
// It checks if things on the page are what they should be.
//
// Two types of assertions:
//   1. AUTO-RETRYING — Playwright keeps checking for a few seconds
//      (like watching through binoculars, waiting for the target to appear)
//   2. NON-RETRYING — checks ONCE, right now, pass or fail
//      (like checking your own ammo count — instant, no waiting)
//
// Most web assertions auto-retry because pages take time to update.
// ============================================================

// --- Load Playwright's test tools ---
import { test, expect } from '@playwright/test';

// ============================================================
// TEST 1: toBeVisible() and toBeHidden() — Can You See It?
// ============================================================
// CoD Analogy: Checking if a target is in your LINE OF SIGHT.
//   toBeVisible()  = "I can see the target"
//   toBeHidden()   = "Target is behind cover / invisible"
// These AUTO-RETRY — Playwright waits a few seconds for the
// element to appear or disappear before failing.
// ============================================================
test('toBeVisible and toBeHidden — checking line of sight', async ({ page }) => {

  // --- Build a page with visible and hidden elements ---
  await page.setContent(`
    <div id="soldier">Soldier is on the field</div>
    <div id="sniper" style="display: none;">Sniper is hidden</div>
    <button id="reveal-btn">Call Sniper</button>
    <script>
      document.getElementById('reveal-btn').addEventListener('click', () => {
        document.getElementById('sniper').style.display = 'block';
      });
    </script>
  `);

  // --- Check the soldier IS visible ---
  // toBeVisible() = "I can see this element on the page"
  await expect(page.locator('#soldier')).toBeVisible();

  // --- Check the sniper is HIDDEN ---
  // toBeHidden() = "this element is not visible on the page"
  await expect(page.locator('#sniper')).toBeHidden();

  // --- Click the button to reveal the sniper ---
  await page.locator('#reveal-btn').click();

  // --- Now the sniper should be VISIBLE ---
  // Playwright auto-retries this — it waits for the sniper to appear
  await expect(page.locator('#sniper')).toBeVisible();
});

// ============================================================
// TEST 2: toHaveText() and toContainText() — Reading Intel
// ============================================================
// CoD Analogy: Reading a document and checking what it says.
//   toHaveText('exact text')    = "this document says EXACTLY this"
//   toContainText('some words') = "this document CONTAINS these words"
// ============================================================
test('toHaveText and toContainText — reading intel documents', async ({ page }) => {

  // --- Build a page with text content ---
  await page.setContent(`
    <h1 id="title">Operation Dark Storm</h1>
    <p id="briefing">Infiltrate the enemy compound and extract the intel package before 0600 hours.</p>
    <div id="status">Mission Status: Active — Priority: HIGH</div>
  `);

  // --- toHaveText checks for EXACT match ---
  // "The title says EXACTLY 'Operation Dark Storm'"
  await expect(page.locator('#title')).toHaveText('Operation Dark Storm');

  // --- toContainText checks for PARTIAL match ---
  // "The briefing CONTAINS the word 'enemy compound' somewhere"
  // It doesn't need to be the full text, just a piece of it
  await expect(page.locator('#briefing')).toContainText('enemy compound');
  await expect(page.locator('#briefing')).toContainText('extract the intel');

  // --- You can also use regex (pattern matching) ---
  // /Active/ = look for the word "Active" anywhere
  // This is like searching a document for a keyword
  await expect(page.locator('#status')).toHaveText(/Active/);

  // --- Regex with case-insensitive flag ---
  // /high/i = look for "high" regardless of uppercase/lowercase
  await expect(page.locator('#status')).toHaveText(/high/i);
});

// ============================================================
// TEST 3: toHaveValue() — Checking What's Loaded in a Slot
// ============================================================
// CoD Analogy: Checking what's loaded in your gear slots.
//   "What weapon is in my primary slot?"
//   "What frequency is my radio set to?"
// toHaveValue() checks the VALUE inside input fields.
// ============================================================
test('toHaveValue — checking input field values', async ({ page }) => {

  // --- Build a page with pre-filled inputs ---
  await page.setContent(`
    <input id="callsign" type="text" value="GHOST" />
    <input id="frequency" type="text" value="" />
    <select id="weapon">
      <option value="ak47">AK-47</option>
      <option value="m4a1" selected>M4A1</option>
      <option value="mp5">MP5</option>
    </select>
  `);

  // --- Check the callsign field has "GHOST" ---
  // toHaveValue('GHOST') = "the value inside this input is GHOST"
  await expect(page.locator('#callsign')).toHaveValue('GHOST');

  // --- Check the frequency field is empty ---
  // toHaveValue('') = "this input is empty — nothing loaded"
  await expect(page.locator('#frequency')).toHaveValue('');

  // --- Check the dropdown's selected value ---
  // The <select> has "m4a1" selected by default
  await expect(page.locator('#weapon')).toHaveValue('m4a1');

  // --- Change the value and check again ---
  await page.locator('#callsign').fill('TIPU');
  await expect(page.locator('#callsign')).toHaveValue('TIPU');
});

// ============================================================
// TEST 4: toHaveAttribute() — Checking Gear Specs
// ============================================================
// CoD Analogy: Inspecting a weapon's SPECS — its damage, range,
// fire rate. In HTML, elements have "attributes" like specs.
//   <a href="url"> → the "href" attribute is the link destination
//   <input type="text"> → the "type" attribute says what kind of input
// toHaveAttribute() checks these specs.
// ============================================================
test('toHaveAttribute — inspecting element specs', async ({ page }) => {

  // --- Build a page with elements that have attributes ---
  await page.setContent(`
    <a id="intel-link" href="https://example.com/intel" target="_blank">View Intel</a>
    <input id="search" type="search" placeholder="Search targets..." disabled />
    <img id="map" src="map.png" alt="Tactical map of sector 7" />
  `);

  // --- Check the link's destination (href attribute) ---
  // toHaveAttribute('href', '...') = "this link points to this URL"
  // It's like checking where a door leads before you walk through it
  await expect(page.locator('#intel-link')).toHaveAttribute('href', 'https://example.com/intel');

  // --- Check the link opens in a new tab ---
  // target="_blank" means it opens in a new window/tab
  await expect(page.locator('#intel-link')).toHaveAttribute('target', '_blank');

  // --- Check the input type ---
  await expect(page.locator('#search')).toHaveAttribute('type', 'search');

  // --- Check the input placeholder text ---
  await expect(page.locator('#search')).toHaveAttribute('placeholder', 'Search targets...');

  // --- Check the image's alt text ---
  await expect(page.locator('#map')).toHaveAttribute('alt', 'Tactical map of sector 7');
});

// ============================================================
// TEST 5: toBeEnabled() and toBeDisabled() — Gear Status
// ============================================================
// CoD Analogy: Some weapons are LOCKED until you reach a
// certain rank. A disabled button is like a locked weapon —
// it's there but you can't use it yet.
//   toBeEnabled()  = "this weapon/button is USABLE"
//   toBeDisabled() = "this weapon/button is LOCKED"
// ============================================================
test('toBeEnabled and toBeDisabled — checking gear status', async ({ page }) => {

  // --- Build a page with enabled and disabled buttons ---
  await page.setContent(`
    <button id="fire">Fire Weapon</button>
    <button id="nuke" disabled>Launch Nuke (Locked)</button>
    <button id="unlock-btn">Unlock Nuke</button>
    <script>
      document.getElementById('unlock-btn').addEventListener('click', () => {
        document.getElementById('nuke').disabled = false;
        document.getElementById('nuke').textContent = 'Launch Nuke (Ready!)';
      });
    </script>
  `);

  // --- Fire button is enabled (usable) ---
  // toBeEnabled() = "this button can be clicked — it's not locked"
  await expect(page.locator('#fire')).toBeEnabled();

  // --- Nuke button is disabled (locked) ---
  // toBeDisabled() = "this button is locked — can't use it yet"
  await expect(page.locator('#nuke')).toBeDisabled();

  // --- Unlock the nuke ---
  await page.locator('#unlock-btn').click();

  // --- Now the nuke button should be enabled ---
  await expect(page.locator('#nuke')).toBeEnabled();
  await expect(page.locator('#nuke')).toHaveText('Launch Nuke (Ready!)');
});

// ============================================================
// TEST 6: toBeChecked() — Switch Status (ON/OFF)
// ============================================================
// CoD Analogy: Checking if a switch is flipped ON or OFF.
//   toBeChecked()     = "the switch is ON"
//   not.toBeChecked() = "the switch is OFF"
// ============================================================
test('toBeChecked — verifying switch positions', async ({ page }) => {

  // --- Build a page with checkboxes and radio buttons ---
  await page.setContent(`
    <label><input type="checkbox" id="night-vision" /> Night Vision</label>
    <label><input type="checkbox" id="silencer" checked /> Silencer</label>
    <label><input type="radio" name="mode" id="stealth" value="stealth" /> Stealth</label>
    <label><input type="radio" name="mode" id="assault" value="assault" checked /> Assault</label>
  `);

  // --- Night vision is OFF (unchecked) ---
  await expect(page.locator('#night-vision')).not.toBeChecked();

  // --- Silencer is ON (checked) ---
  await expect(page.locator('#silencer')).toBeChecked();

  // --- Stealth radio is NOT selected ---
  await expect(page.locator('#stealth')).not.toBeChecked();

  // --- Assault radio IS selected ---
  await expect(page.locator('#assault')).toBeChecked();

  // --- Toggle night vision ON ---
  await page.locator('#night-vision').check();
  await expect(page.locator('#night-vision')).toBeChecked();

  // --- Switch to stealth mode ---
  await page.locator('#stealth').check();
  await expect(page.locator('#stealth')).toBeChecked();
  // When you select stealth, assault automatically unchecks (radio buttons)
  await expect(page.locator('#assault')).not.toBeChecked();
});

// ============================================================
// TEST 7: toHaveCount() — Counting Targets
// ============================================================
// CoD Analogy: Counting enemies in a room before breaching.
//   "How many hostiles are in there?"
//   "There should be exactly 4 enemies."
// toHaveCount() checks the NUMBER of elements that match.
// ============================================================
test('toHaveCount — counting elements on the page', async ({ page }) => {

  // --- Build a page with lists ---
  await page.setContent(`
    <ul id="weapon-rack">
      <li class="weapon">AK-47</li>
      <li class="weapon">M4A1</li>
      <li class="weapon">MP5</li>
      <li class="weapon">SCAR-H</li>
    </ul>
    <ul id="intel-list">
      <li class="intel">Document Alpha</li>
      <li class="intel">Document Bravo</li>
    </ul>
  `);

  // --- Count weapons on the rack ---
  // toHaveCount(4) = "there should be exactly 4 weapons"
  await expect(page.locator('.weapon')).toHaveCount(4);

  // --- Count intel documents ---
  await expect(page.locator('.intel')).toHaveCount(2);

  // --- Count all list items on the page ---
  await expect(page.locator('li')).toHaveCount(6); // 4 weapons + 2 intel
});

// ============================================================
// TEST 8: toHaveURL() and toHaveTitle() — Mission Location
// ============================================================
// CoD Analogy: Verifying you're at the RIGHT LOCATION.
//   toHaveURL()   = "Are we at the correct coordinates?"
//   toHaveTitle() = "Is this the right mission area?"
// These check the PAGE itself, not an element on the page.
// Note: expect(page) not expect(locator)!
// ============================================================
test('toHaveURL and toHaveTitle — verifying mission location', async ({ page }) => {

  // --- Go to a real page ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Check the URL ---
  // toHaveURL() checks the address bar of the browser
  // It's like checking your GPS coordinates
  await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');

  // --- Check URL with partial match using regex ---
  // /login/ = "the URL contains the word 'login' somewhere"
  await expect(page).toHaveURL(/login/);

  // --- Check the page title ---
  // toHaveTitle() checks the browser tab title
  // It's like checking the name of the mission area on your map
  await expect(page).toHaveTitle('The Internet');
});

// ============================================================
// TEST 9: toHaveCSS() — Checking Visual Appearance
// ============================================================
// CoD Analogy: Checking your gear's VISUAL appearance.
//   "Is my weapon camo green or desert tan?"
//   "Is the alert light red or green?"
// toHaveCSS() checks the STYLE of elements (color, size, etc.)
// ============================================================
test('toHaveCSS — checking visual styles', async ({ page }) => {

  // --- Build a page with styled elements ---
  await page.setContent(`
    <div id="alert" style="color: red; font-size: 20px; font-weight: bold;">
      ENEMY SPOTTED!
    </div>
    <div id="safe" style="color: green; background-color: black; padding: 10px;">
      Area Secure
    </div>
    <div id="hidden-msg" style="display: none;">
      Secret Intel
    </div>
  `);

  // --- Check the alert text is red ---
  // toHaveCSS('color', '...') = "check the text color"
  // Note: CSS colors get converted to rgb() format by the browser
  // red = rgb(255, 0, 0)
  await expect(page.locator('#alert')).toHaveCSS('color', 'rgb(255, 0, 0)');

  // --- Check the font size ---
  await expect(page.locator('#alert')).toHaveCSS('font-size', '20px');

  // --- Check the font is bold ---
  // bold = font-weight of 700
  await expect(page.locator('#alert')).toHaveCSS('font-weight', '700');

  // --- Check the safe zone has green text ---
  // green = rgb(0, 128, 0)
  await expect(page.locator('#safe')).toHaveCSS('color', 'rgb(0, 128, 0)');

  // --- Check the safe zone has black background ---
  // black = rgb(0, 0, 0)
  await expect(page.locator('#safe')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
});

// ============================================================
// TEST 10: not — Flipping Any Assertion (The Opposite Check)
// ============================================================
// CoD Analogy: Sometimes you check what DIDN'T happen:
//   "The building is NOT destroyed" (mission failed?)
//   "The target is NOT down" (missed shot?)
// .not flips ANY assertion to its opposite.
// ============================================================
test('not — checking the opposite of things', async ({ page }) => {

  // --- Build a page ---
  await page.setContent(`
    <div id="target" style="display: block;">Target Alpha</div>
    <input id="field" type="text" value="" />
    <button id="btn" disabled>Locked Button</button>
    <div id="empty-zone"></div>
  `);

  // --- Check the target is NOT hidden ---
  // .not reverses the check
  await expect(page.locator('#target')).not.toBeHidden();

  // --- Check the field does NOT have value "hello" ---
  await expect(page.locator('#field')).not.toHaveValue('hello');

  // --- Check the button is NOT enabled ---
  await expect(page.locator('#btn')).not.toBeEnabled();

  // --- Check that a non-existent element is NOT visible ---
  // If no element matches, toBeVisible fails — not.toBeVisible passes
  await expect(page.locator('#does-not-exist')).not.toBeVisible();

  // --- Check the empty zone does NOT contain certain text ---
  await expect(page.locator('#empty-zone')).not.toHaveText('Hello');
});

// ============================================================
// TEST 11: Soft Assertions — Report All Failures, Don't Stop
// ============================================================
// CoD Analogy: Normal assertions are like INSTANT DEATH mode —
// first mistake and the mission is OVER.
// Soft assertions are like DAMAGE TRACKING mode —
// you take hits but keep going, and the report shows ALL damage.
// Use expect.soft() instead of expect() to keep going after a fail.
// ============================================================
test('soft assertions — keep going after failures', async ({ page }) => {

  // --- Build a page with a mission report ---
  await page.setContent(`
    <div id="operator">TIPU</div>
    <div id="rank">Captain</div>
    <div id="kills">15</div>
    <div id="status">Active</div>
  `);

  // --- Soft assertions — ALL of these run even if one fails ---
  // expect.soft() = "check this, but DON'T stop the test if it fails"
  // The test keeps running and reports ALL failures at the end
  // Regular expect() would STOP immediately on the first failure

  await expect.soft(page.locator('#operator')).toHaveText('TIPU');
  await expect.soft(page.locator('#rank')).toHaveText('Captain');
  await expect.soft(page.locator('#kills')).toHaveText('15');
  await expect.soft(page.locator('#status')).toHaveText('Active');

  // --- If any soft assertion above failed, we'd still reach here ---
  // This is great for checking a WHOLE report/form at once
  // instead of stopping at the very first wrong field
});

// ============================================================
// TEST 12: Real Mission — Full Page Verification
// ============================================================
// CoD Analogy: After-mission debrief — go through the ENTIRE
// checklist to verify everything went right.
// This test combines MANY different assertions on one page.
// ============================================================
test('real mission — full page verification after login', async ({ page }) => {

  // --- Go to the login page ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // === VERIFY THE LOGIN PAGE ===

  // --- Check we're at the right URL ---
  await expect(page).toHaveURL(/login/);

  // --- Check the page title ---
  await expect(page).toHaveTitle('The Internet');

  // --- Check the heading is visible ---
  await expect(page.getByRole('heading', { name: 'Login Page' })).toBeVisible();

  // --- Check the username field is enabled and empty ---
  const username = page.locator('#username');
  await expect(username).toBeEnabled();
  await expect(username).toHaveValue('');

  // --- Check the password field exists ---
  const password = page.locator('#password');
  await expect(password).toBeVisible();
  await expect(password).toBeEnabled();

  // --- Check the login button exists and is enabled ---
  const loginBtn = page.locator('button[type="submit"]');
  await expect(loginBtn).toBeVisible();
  await expect(loginBtn).toBeEnabled();

  // === PERFORM THE LOGIN ===
  await username.fill('tomsmith');
  await password.fill('SuperSecretPassword!');
  await loginBtn.click();

  // === VERIFY AFTER LOGIN ===

  // --- Wait for navigation ---
  await page.waitForLoadState('networkidle');

  // --- Check the URL changed to /secure ---
  await expect(page).toHaveURL(/secure/);

  // --- Check a flash message appeared ---
  const flash = page.locator('#flash');
  await expect(flash).toBeVisible();

  // --- Check the message contains success text ---
  await expect(flash).toContainText('You logged into a secure area!');

  // --- Check the logout button is now visible ---
  const logoutBtn = page.getByRole('link', { name: /Logout/i });
  await expect(logoutBtn).toBeVisible();

  // --- Log the result ---
  const flashText = await flash.textContent();
  console.log('Login verification:', flashText?.trim());
});