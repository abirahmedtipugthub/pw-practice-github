// CoD Analogy: Real missions have WAIT POINTS — hold position until the airstrike lands, wait for the patrol to pass, wait for the door to open. This is how Playwright handles timing.

// Test 1 — Auto-waiting (Playwright waits for you automatically)
// Test 2 — waitForSelector() — wait for an element to appear
// Test 3 — waitForSelector({ state: 'hidden' }) — wait for something to disappear
// Test 4 — waitForLoadState() — wait for page to fully load
// Test 5 — waitForURL() — wait for URL to change (navigation)
// Test 6 — waitForResponse() — wait for server response
// Test 7 — Custom timeouts — setting how long to wait
// Test 8 — waitForTimeout() — hard wait (AVOID this, last resort only!)
// Test 9 — Promise.all() — wait and act at the same time
// Test 10 — Real mission with multiple wait stages

// ============================================================
// F-13: Waits & Auto-Waiting — Patience on the Battlefield
// ============================================================
// CoD Campaign Analogy:
// In a real mission, things don't happen INSTANTLY:
//   - You call an airstrike → wait for the jets to arrive
//   - You breach a door → wait for the flashbang to go off
//   - You hack a terminal → wait for the progress bar to finish
//
// Websites work the same way:
//   - You click a button → wait for the page to load
//   - You submit a form → wait for the response
//   - You scroll down → wait for new content to appear
//
// Playwright has SMART WAITING built in (auto-waiting).
// But sometimes you need MANUAL waits for special situations.
//
// Types of waiting:
//   AUTO-WAIT    = Playwright handles it (most actions do this)
//   waitForSelector()    = wait for a specific element to appear
//   waitForLoadState()   = wait for the page to finish loading
//   waitForURL()         = wait until the URL changes
//   waitForResponse()    = wait for a network response
//   waitForTimeout()     = hard wait (LAST RESORT — avoid this!)
// ============================================================

// --- Load Playwright's test tools ---
import { test, expect } from '@playwright/test';

// ============================================================
// TEST 1: Auto-Waiting — Playwright's Built-in Patience
// ============================================================
// CoD Analogy: Your soldier AUTOMATICALLY waits for a door
// to open before walking through it. You don't need to tell
// them to wait — they just do it.
// Playwright auto-waits on click(), fill(), check(), etc.
// ============================================================
test('auto-waiting — Playwright waits automatically', async ({ page }) => {

  // --- Build a page where a button appears AFTER a delay ---
  await page.setContent(`
    <div id="status">Loading mission data...</div>
    <script>
      // This button appears after 2 seconds (simulating a slow load)
      setTimeout(() => {
        const btn = document.createElement('button');
        btn.id = 'start-mission';
        btn.textContent = 'Start Mission';
        btn.addEventListener('click', () => {
          document.getElementById('status').textContent = 'Mission started!';
        });
        document.body.appendChild(btn);
      }, 2000);
    </script>
  `);

  // --- Click the button — Playwright auto-waits for it to appear ---
  // Even though the button doesn't exist yet (it appears after 2 seconds),
  // Playwright automatically waits for it before clicking.
  // It's like your soldier waiting at a door until it opens.
  // NO manual wait needed!
  await page.locator('#start-mission').click();

  // --- Check the status changed ---
  await expect(page.locator('#status')).toHaveText('Mission started!');
});

// ============================================================
// TEST 2: waitForSelector() — Wait for a Specific Target
// ============================================================
// CoD Analogy: "Hold position until you see the target appear."
// You're watching through your scope, waiting for the enemy
// to step out from behind cover.
// waitForSelector() waits until a specific element appears on the page.
// ============================================================
test('waitForSelector — wait for target to appear', async ({ page }) => {

  // --- Build a page where content loads after a delay ---
  await page.setContent(`
    <div id="area">Scanning area...</div>
    <script>
      // Enemy appears after 2 seconds
      setTimeout(() => {
        const enemy = document.createElement('div');
        enemy.id = 'enemy';
        enemy.className = 'hostile';
        enemy.textContent = 'Enemy spotted at coordinates 47.3, 12.8';
        document.getElementById('area').appendChild(enemy);
      }, 2000);
    </script>
  `);

  // --- Wait for the enemy element to appear ---
  // waitForSelector('#enemy') = "hold position until #enemy appears"
  // This PAUSES the test until the element exists on the page
  await page.waitForSelector('#enemy');

  // --- Now we can safely interact with it ---
  await expect(page.locator('#enemy')).toHaveText('Enemy spotted at coordinates 47.3, 12.8');
});

// ============================================================
// TEST 3: waitForSelector — Wait for Element to DISAPPEAR
// ============================================================
// CoD Analogy: "Wait until the patrol guard walks away."
// Sometimes you need to wait for something to LEAVE, not arrive.
// Use { state: 'hidden' } to wait for something to disappear.
// ============================================================
test('waitForSelector — wait for element to disappear', async ({ page }) => {

  // --- Build a page with a loading spinner that disappears ---
  await page.setContent(`
    <div id="spinner">Loading intel... Please wait...</div>
    <div id="content" style="display: none;">
      Intel loaded: Enemy base is at Grid Reference 445.
    </div>
    <script>
      // After 2 seconds, hide the spinner and show the content
      setTimeout(() => {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('content').style.display = 'block';
      }, 2000);
    </script>
  `);

  // --- Wait for the spinner to disappear ---
  // { state: 'hidden' } = "wait until this element is no longer visible"
  // It's like waiting for the guard to walk away before moving
  await page.waitForSelector('#spinner', { state: 'hidden' });

  // --- Now the content should be visible ---
  await expect(page.locator('#content')).toBeVisible();
  await expect(page.locator('#content')).toContainText('Grid Reference 445');
});

// ============================================================
// TEST 4: waitForLoadState() — Wait for the Page to be Ready
// ============================================================
// CoD Analogy: Before starting a mission, you wait for the
// briefing screen to fully load — all the maps, photos,
// and documents need to be ready before you proceed.
// waitForLoadState() waits for different levels of "ready":
//   'load'        = page finished loading (default)
//   'domcontentloaded' = HTML structure is ready (but images may still load)
//   'networkidle' = no network activity for 500ms (everything settled)
// ============================================================
test('waitForLoadState — wait for page to fully load', async ({ page }) => {

  // --- Go to a real website ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Wait for the page to be completely idle ---
  // 'networkidle' = "wait until there's no more network traffic"
  // This means all images, scripts, and data have finished loading
  // It's like waiting until the entire briefing room is set up
  await page.waitForLoadState('networkidle');

  // --- Now we KNOW everything is loaded ---
  await expect(page.locator('#username')).toBeVisible();
  await expect(page.locator('#password')).toBeVisible();
});

// ============================================================
// TEST 5: waitForURL() — Wait for Location Change
// ============================================================
// CoD Analogy: After you breach and clear a room, you move
// to the NEXT room. waitForURL() is like waiting until your
// GPS shows you've arrived at the next checkpoint.
// ============================================================
test('waitForURL — wait for navigation to complete', async ({ page }) => {

  // --- Go to login page ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Fill in credentials and click login ---
  await page.locator('#username').fill('tomsmith');
  await page.locator('#password').fill('SuperSecretPassword!');
  await page.locator('button[type="submit"]').click();

  // --- Wait for the URL to change to /secure ---
  // waitForURL() = "wait until the address bar shows this URL"
  // It's like waiting for your GPS to confirm you've reached the checkpoint
  // You can use a string or regex pattern
  await page.waitForURL('**/secure');

  // --- Now we're on the secure page ---
  await expect(page).toHaveURL(/secure/);
  await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
});

// ============================================================
// TEST 6: waitForResponse() — Wait for Intel from HQ
// ============================================================
// CoD Analogy: You radio HQ for intel and WAIT for their
// response. waitForResponse() waits for a specific network
// request to come back from the server.
// ============================================================
test('waitForResponse — wait for server response', async ({ page }) => {

  // --- Go to a page ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Set up the wait BEFORE triggering the action ---
  // This is important: start listening BEFORE you click!
  // It's like tuning your radio to the right frequency
  // BEFORE you request intel from HQ
  const responsePromise = page.waitForResponse(
    // This function checks each response — return true for the one we want
    // response.url() gives us the URL of the network request
    // We want the response from the login action
    (response) => response.url().includes('/authenticate') || response.url().includes('/secure')
  );

  // --- Now trigger the action that causes the network request ---
  await page.locator('#username').fill('tomsmith');
  await page.locator('#password').fill('SuperSecretPassword!');
  await page.locator('button[type="submit"]').click();

  // --- Wait for the response to arrive ---
  const response = await responsePromise;

  // --- Check the response status ---
  // status() gives the HTTP status code (200 = OK, 302 = redirect, etc.)
  console.log('Response URL:', response.url());
  console.log('Response status:', response.status());

  // --- The login should have succeeded (redirected) ---
  // 200 = OK, 302 = redirect (both mean success for a login)
  expect(response.status()).toBeLessThan(400);
});

// ============================================================
// TEST 7: Timeouts — How Long to Wait Before Giving Up
// ============================================================
// CoD Analogy: Every wait has a TIMER. If the target doesn't
// appear within the time limit, the mission fails.
// Default timeout is 5 seconds (5000ms).
// You can change it per-assertion or per-action.
// ============================================================
test('timeouts — setting custom wait times', async ({ page }) => {

  // --- Build a page with elements that appear at different times ---
  await page.setContent(`
    <div id="area">Watching...</div>
    <script>
      // Fast element — appears in 1 second
      setTimeout(() => {
        const fast = document.createElement('div');
        fast.id = 'fast-target';
        fast.textContent = 'Fast target appeared!';
        document.getElementById('area').appendChild(fast);
      }, 1000);

      // Slow element — appears in 3 seconds
      setTimeout(() => {
        const slow = document.createElement('div');
        slow.id = 'slow-target';
        slow.textContent = 'Slow target appeared!';
        document.getElementById('area').appendChild(slow);
      }, 3000);
    </script>
  `);

  // --- Wait for fast target with SHORT timeout ---
  // { timeout: 3000 } = "wait up to 3 seconds"
  // 3000ms is enough for the 1-second delay
  await expect(page.locator('#fast-target')).toBeVisible({ timeout: 3000 });

  // --- Wait for slow target with LONGER timeout ---
  // { timeout: 10000 } = "wait up to 10 seconds"
  // We give extra time because this target is slow
  await expect(page.locator('#slow-target')).toBeVisible({ timeout: 10000 });
});

// ============================================================
// TEST 8: waitForTimeout() — Hard Wait (AVOID THIS!)
// ============================================================
// CoD Analogy: This is like saying "just stand here for 3 seconds
// doing nothing." It works, but it's WASTEFUL.
// If the thing you're waiting for happens in 1 second,
// you still wait the full 3 seconds for no reason.
// ONLY use this as a last resort when nothing else works.
// ============================================================
test('waitForTimeout — hard wait (use only as last resort)', async ({ page }) => {

  // --- Build a page with a delayed change ---
  await page.setContent(`
    <div id="countdown">3...</div>
    <script>
      setTimeout(() => {
        document.getElementById('countdown').textContent = '2...';
      }, 1000);
      setTimeout(() => {
        document.getElementById('countdown').textContent = '1...';
      }, 2000);
      setTimeout(() => {
        document.getElementById('countdown').textContent = 'GO!';
      }, 3000);
    </script>
  `);

  // --- BAD WAY: Hard wait (don't do this in real tests!) ---
  // waitForTimeout(3500) = "stand still for 3.5 seconds"
  // This works but wastes time — AVOID in real projects
  // Shown here only so you KNOW it exists
  await page.waitForTimeout(3500);

  // --- Check the countdown finished ---
  await expect(page.locator('#countdown')).toHaveText('GO!');

  // --- GOOD WAY: Use auto-retrying assertion instead ---
  // This is how you SHOULD do it:
  // await expect(page.locator('#countdown')).toHaveText('GO!', { timeout: 5000 });
  // ^ This checks repeatedly until it matches, no wasted time!
});

// ============================================================
// TEST 9: Promise.all — Do Two Things at Once
// ============================================================
// CoD Analogy: Sometimes you need to do TWO things at once:
//   Sniper covers the door WHILE breacher kicks it open.
// Promise.all() lets you start WAITING and ACTING at the same time.
// This is important when a click triggers a navigation —
// you need to be already listening before the page changes.
// ============================================================
test('Promise.all — wait and act at the same time', async ({ page }) => {

  // --- Build a page with a link that navigates ---
  await page.setContent(`
    <a href="https://the-internet.herokuapp.com/login" id="go-login">Go to Login</a>
  `);

  // --- Do BOTH at the same time: wait for navigation AND click ---
  // Promise.all() runs both promises together:
  //   1. Start waiting for the page to load
  //   2. Click the link that triggers navigation
  // It's like the sniper and breacher acting at the same moment
  await Promise.all([
    page.waitForLoadState('networkidle'),  // Sniper: watching
    page.locator('#go-login').click()       // Breacher: acting
  ]);

  // --- Verify we arrived at the login page ---
  await expect(page).toHaveURL(/login/);
  await expect(page.locator('#username')).toBeVisible();
});

// ============================================================
// TEST 10: Real Mission — Waiting for Dynamic Content
// ============================================================
// CoD Analogy: A full mission with MULTIPLE wait points.
// Just like a real operation where you hold at checkpoints,
// wait for signals, and move when it's safe.
// ============================================================
test('real mission — multiple wait scenarios', async ({ page }) => {

  // --- Build a complex page that loads in stages ---
  await page.setContent(`
    <h1>Mission Control Center</h1>
    <div id="loading-bar">Loading: 0%</div>
    <div id="stage1" style="display: none;">Stage 1: Team assembled</div>
    <div id="stage2" style="display: none;">Stage 2: Equipment ready</div>
    <div id="stage3" style="display: none;">Stage 3: Mission is GO</div>
    <button id="launch" style="display: none;" disabled>Launch Mission</button>
    <div id="result"></div>
    <script>
      // Stage 1 appears after 1 second
      setTimeout(() => {
        document.getElementById('loading-bar').textContent = 'Loading: 33%';
        document.getElementById('stage1').style.display = 'block';
      }, 1000);

      // Stage 2 appears after 2 seconds
      setTimeout(() => {
        document.getElementById('loading-bar').textContent = 'Loading: 66%';
        document.getElementById('stage2').style.display = 'block';
      }, 2000);

      // Stage 3 and launch button appear after 3 seconds
      setTimeout(() => {
        document.getElementById('loading-bar').textContent = 'Loading: 100%';
        document.getElementById('stage3').style.display = 'block';
        const btn = document.getElementById('launch');
        btn.style.display = 'block';
        btn.disabled = false;
        btn.addEventListener('click', () => {
          document.getElementById('result').textContent = 'MISSION LAUNCHED SUCCESSFULLY!';
        });
      }, 3000);
    </script>
  `);

  // --- Wait for Stage 1 ---
  await expect(page.locator('#stage1')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('#stage1')).toHaveText('Stage 1: Team assembled');

  // --- Wait for Stage 2 ---
  await expect(page.locator('#stage2')).toBeVisible({ timeout: 5000 });

  // --- Wait for Stage 3 ---
  await expect(page.locator('#stage3')).toBeVisible({ timeout: 5000 });

  // --- Wait for the launch button to become enabled ---
  await expect(page.locator('#launch')).toBeEnabled({ timeout: 5000 });

  // --- Check the loading bar shows 100% ---
  await expect(page.locator('#loading-bar')).toHaveText('Loading: 100%');

  // --- Click launch ---
  await page.locator('#launch').click();

  // --- Verify the mission launched ---
  await expect(page.locator('#result')).toHaveText('MISSION LAUNCHED SUCCESSFULLY!');

  // --- Log success ---
  console.log('All stages cleared. Mission launched!');
});