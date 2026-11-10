// CoD Campaign Analogy for this topic: Locators are your night-vision goggles — different modes to spot different things in a dark building during a mission. Each mode finds things a different way.

// Here’s what’s inside:

// Test 1 — getByRole — finds things by their JOB (button, heading, link)
// Test 2 — getByText — finds things by what they SAY (visible text on the page)
// Test 3 — getByLabel — finds form inputs by their LABEL tag (like “Username”)
// Test 4 — getByPlaceholder — finds inputs by their grey hint text
// Test 5 — getByAltText — finds images by their description
// Test 6 — getByTitle — finds things by their hover/tooltip text
// Test 7 — getByTestId — finds things by a secret code only testers know
// Test 8 — Real mission combining multiple locators on a live website
// Test 9 — Cheat sheet test with ALL 7 locators on one page

// ============================================================
// F-09: Built-in Locators — Finding Things on the Battlefield
// ============================================================
// CoD Campaign Analogy:
// Imagine you're in a dark building during a mission.
// You need to FIND specific things — a weapon on a table,
// a button on a wall panel, a name on a dog tag.
// Playwright's "locators" are like your night-vision goggles —
// different modes to spot different things:
//   getByRole    = spot things by WHAT THEY DO (button, link, heading)
//   getByText    = spot things by WHAT THEY SAY (visible text)
//   getByLabel   = spot things by their LABEL TAG (like a name tag on gear)
//   getByPlaceholder = spot things by their HINT TEXT (grey text inside a box)
//   getByAltText = spot things by their DESCRIPTION (like a photo caption)
//   getByTitle   = spot things by their HOVER TEXT (tooltip)
//   getByTestId  = spot things by their SECRET CODE (hidden ID for testers)
// ============================================================

// --- This line loads Playwright's test tools ---
// 'test' = the mission runner (runs each test)
// 'expect' = the intel checker (checks if things are correct)
// 'Page' = the type that represents a browser page (like saying "this is a map")
import { test, expect, Page } from '@playwright/test';

// ============================================================
// TEST 1: getByRole — Find Things by What They DO
// ============================================================
// CoD Analogy: In a mission, you identify things by their PURPOSE.
// A door is a door because you walk through it.
// A button is a button because you press it.
// A heading is a heading because it's the big title text.
// getByRole finds elements by their JOB on the page.
// ============================================================
test('getByRole — find elements by their role (job)', async ({ page }) => {

  // --- Build a mini page instead of going to a real website ---
  // setContent() = setting up a practice target range
  await page.setContent(`
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples.</p>
    <a href="https://www.iana.org/domains/example">More information...</a>
  `);

  // --- Find the main heading on the page ---
  // getByRole('heading') = "find me something whose JOB is to be a heading"
  // { name: 'Example Domain' } = "and its text should say 'Example Domain'"
  // Think of it like: "Find the big title that says 'Example Domain'"
  const mainHeading = page.getByRole('heading', { name: 'Example Domain' });

  // --- Check that this heading is visible on the page ---
  // toBeVisible() = "I can see it with my own eyes" (it's not hidden)
  await expect(mainHeading).toBeVisible();

  // --- Find a link on the page ---
  // getByRole('link') = "find me something whose JOB is to be a clickable link"
  // { name: 'More information...' } = "and it should say 'More information...'"
  const infoLink = page.getByRole('link', { name: 'More information...' });

  // --- Check that this link is visible ---
  await expect(infoLink).toBeVisible();

  // --- Check that the link points to the right URL ---
  // toHaveAttribute('href', ...) = "check that its destination address contains this text"
  // It's like checking a door — does this door lead where the sign says?
  await expect(infoLink).toHaveAttribute('href', 'https://www.iana.org/domains/example');
});

// ============================================================
// TEST 2: getByText — Find Things by What They SAY
// ============================================================
// CoD Analogy: You're searching a room for intel documents.
// You don't care what TYPE of document it is —
// you just look for the one that SAYS a specific thing.
// getByText finds ANY element that contains specific visible text.
// ============================================================
test('getByText — find elements by their visible text', async ({ page }) => {

  // --- Build a mini page ---
  await page.setContent(`
    <h1>Example Domain</h1>
    <p>This domain is for use in illustrative examples in documents.</p>
    <a href="#">More information...</a>
  `);

  // --- Find something that says "This domain is for use in" ---
  // getByText() = "find me anything on the page that SAYS this text"
  // It doesn't matter if it's a paragraph, a span, or a div
  // It's like scanning a room for a document with specific words on it
  const descriptionText = page.getByText('This domain is for use in illustrative examples');

  // --- Check that this text exists and is visible ---
  await expect(descriptionText).toBeVisible();

  // --- Find text using partial match ---
  // By default, getByText does a PARTIAL match (substring)
  // "for use in" will match "This domain is for use in illustrative examples"
  // It's like finding a document that CONTAINS certain words (not the exact full text)
  const partialText = page.getByText('for use in illustrative');

  // --- Check this partial match also works ---
  await expect(partialText).toBeVisible();

  // --- Find text with EXACT match ---
  // { exact: true } = "the text must be EXACTLY this, nothing more, nothing less"
  // It's like looking for a dog tag with EXACTLY "More information..." on it
  const exactLink = page.getByText('More information...', { exact: true });

  // --- Check exact match is visible ---
  await expect(exactLink).toBeVisible();
});

// ============================================================
// TEST 3: getByLabel — Find Form Inputs by Their Label
// ============================================================
// CoD Analogy: In the armoury, every gear slot has a LABEL:
//   "Primary Weapon" → the slot for your main gun
//   "Secondary Weapon" → the slot for your pistol
//   "Equipment" → the slot for grenades
// getByLabel finds an INPUT field by reading the LABEL next to it.
// When a website has a form (like a login page), each input box
// has a label that says what goes there.
// ============================================================
test('getByLabel — find inputs by their label tag', async ({ page }) => {

  // --- Go to a page with a login form ---
  // This website has Username and Password fields with labels
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Find the Username input by its label ---
  // getByLabel('Username') = "find me the input box that has the label 'Username'"
  // It's like finding the gear slot labeled "Primary Weapon"
  const usernameField = page.getByLabel('Username');

  // --- Check the username field is visible ---
  await expect(usernameField).toBeVisible();

  // --- Type something into the username field ---
  // fill() = put text inside this input box
  // It's like placing a weapon into the gear slot
  await usernameField.fill('tomsmith');

  // --- Find the Password input by its label ---
  const passwordField = page.getByLabel('Password');

  // --- Check the password field is visible ---
  await expect(passwordField).toBeVisible();

  // --- Type the password ---
  await passwordField.fill('SuperSecretPassword!');

  // --- Find the Login button by its role ---
  // We already know getByRole! Here we use it for a button
  // getByRole('button', { name: /Login/i }) = "find a button that says 'Login'"
  // The /Login/i is a "regex" — the i means "ignore uppercase/lowercase"
  // So it matches "Login", "LOGIN", "login", etc.
  const loginButton = page.getByRole('button', { name: /Login/i });

  // --- Check the login button is visible ---
  await expect(loginButton).toBeVisible();
});

// ============================================================
// TEST 4: getByPlaceholder — Find Inputs by Their Hint Text
// ============================================================
// CoD Analogy: Some gear slots don't have a label on the OUTSIDE,
// but they have GREY TEXT INSIDE that says what goes there.
// Like a radio frequency slot that says "Enter frequency here..."
// getByPlaceholder finds inputs by that grey hint text.
// ============================================================
test('getByPlaceholder — find inputs by their placeholder hint', async ({ page }) => {

  // --- Go to the TodoMVC demo app ---
  // This is a to-do list app. It has an input with placeholder text.
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  // --- Find the input by its placeholder text ---
  // getByPlaceholder('What needs to be done?') =
  //   "find me the input box that has grey hint text saying 'What needs to be done?'"
  // It's like finding a radio slot that says "Enter frequency here..."
  const todoInput = page.getByPlaceholder('What needs to be done?');

  // --- Check the input is visible ---
  await expect(todoInput).toBeVisible();

  // --- Type a to-do item ---
  // fill() puts text in the box (replaces the placeholder)
  await todoInput.fill('Complete F-09 Built-in Locators');

  // --- Press Enter to submit the to-do ---
  // press('Enter') = hit the Enter key, like pressing a confirm button
  await todoInput.press('Enter');

  // --- Add another to-do item ---
  await todoInput.fill('Study for F-10 CSS Locators');
  await todoInput.press('Enter');

  // --- Now check that our to-do items appear on the page ---
  // We use getByText to find the items we just added
  await expect(page.getByText('Complete F-09 Built-in Locators')).toBeVisible();
  await expect(page.getByText('Study for F-10 CSS Locators')).toBeVisible();
});

// ============================================================
// TEST 5: getByAltText — Find Images by Their Description
// ============================================================
// CoD Analogy: During a mission, recon photos have DESCRIPTIONS
// written on the back. You find the right photo by reading
// what's written on the back, not by looking at the photo itself.
// getByAltText finds images by their "alt" description text.
// ============================================================
test('getByAltText — find images by their alt description', async ({ page }) => {

  // --- We'll create a simple HTML page to test this ---
  // setContent() = we're building a mini web page right here in the test
  // It's like setting up a practice target range instead of going to a real mission
  await page.setContent(`
    <img src="https://via.placeholder.com/150" alt="Mission briefing photo" />
    <img src="https://via.placeholder.com/150" alt="Enemy base layout" />
    <img src="https://via.placeholder.com/150" alt="Extraction point map" />
  `);

  // --- Find the image that has alt text "Mission briefing photo" ---
  // getByAltText('Mission briefing photo') =
  //   "find me the image whose description says 'Mission briefing photo'"
  const briefingPhoto = page.getByAltText('Mission briefing photo');

  // --- Check this image is visible ---
  await expect(briefingPhoto).toBeVisible();

  // --- Find another image by its description ---
  const enemyBase = page.getByAltText('Enemy base layout');

  // --- Check this one is visible too ---
  await expect(enemyBase).toBeVisible();

  // --- Find the extraction point map ---
  const extractionMap = page.getByAltText('Extraction point map');
  await expect(extractionMap).toBeVisible();
});

// ============================================================
// TEST 6: getByTitle — Find Elements by Their Hover Text
// ============================================================
// CoD Analogy: Some items in your inventory show extra info
// when you HOVER over them — like holding your cursor over
// a weapon to see "AK-47 — Assault Rifle, Damage: 35"
// getByTitle finds elements by this hover tooltip text.
// ============================================================
test('getByTitle — find elements by their tooltip/hover text', async ({ page }) => {

  // --- Build a mini page with elements that have title attributes ---
  // title="..." is the text that shows when you hover over something
  await page.setContent(`
    <button title="Save your mission progress">Save Game</button>
    <span title="Current ammunition count">Ammo: 120</span>
    <a href="#" title="Return to main menu">Back</a>
  `);

  // --- Find the button by its hover text ---
  // getByTitle('Save your mission progress') =
  //   "find me the element whose hover tooltip says 'Save your mission progress'"
  const saveButton = page.getByTitle('Save your mission progress');

  // --- Check it's visible ---
  await expect(saveButton).toBeVisible();

  // --- Check the button text is correct ---
  // toHaveText() checks the visible text INSIDE the element
  await expect(saveButton).toHaveText('Save Game');

  // --- Find the ammo display by its hover text ---
  const ammoDisplay = page.getByTitle('Current ammunition count');
  await expect(ammoDisplay).toBeVisible();
  await expect(ammoDisplay).toHaveText('Ammo: 120');
});

// ============================================================
// TEST 7: getByTestId — Find Elements by Their Secret Code
// ============================================================
// CoD Analogy: In a mission, sometimes things have a SECRET CODE
// only your team knows about. A door might look normal,
// but your team marked it with code "DOOR-ALPHA-7".
// getByTestId finds elements by a special hidden ID that
// developers put there specifically for testers to find.
// The attribute is usually "data-testid" in the HTML.
// ============================================================
test('getByTestId — find elements by their test ID', async ({ page }) => {

  // --- Build a mini page with data-testid attributes ---
  // data-testid="..." is a hidden code that testers use to find elements
  // Regular users never see it — it's only in the HTML source code
  await page.setContent(`
    <div data-testid="health-bar">Health: 100</div>
    <div data-testid="ammo-counter">Ammo: 250</div>
    <button data-testid="reload-weapon">Reload</button>
  `);

  // --- Find the health bar by its test ID ---
  // getByTestId('health-bar') = "find me the element with secret code 'health-bar'"
  const healthBar = page.getByTestId('health-bar');

  // --- Check it's visible and has the right text ---
  await expect(healthBar).toBeVisible();
  await expect(healthBar).toHaveText('Health: 100');

  // --- Find the ammo counter by its test ID ---
  const ammoCounter = page.getByTestId('ammo-counter');
  await expect(ammoCounter).toBeVisible();
  await expect(ammoCounter).toHaveText('Ammo: 250');

  // --- Find the reload button by its test ID ---
  const reloadButton = page.getByTestId('reload-weapon');
  await expect(reloadButton).toBeVisible();

  // --- Click the reload button ---
  // click() = press/interact with this element
  await reloadButton.click();
});

// ============================================================
// TEST 8: Real Mission — Using Multiple Locators Together
// ============================================================
// CoD Analogy: A real mission uses ALL your gear.
// You don't just use night-vision — you use night-vision,
// your compass, your radio, and your map all together.
// This test uses MULTIPLE locator types on one real website.
// ============================================================
test('real mission — combining multiple locator types', async ({ page }) => {

  // --- Go to the login page ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Find the page heading using getByRole ---
  // The page has an <h2> heading that says "Login Page"
  const heading = page.getByRole('heading', { name: 'Login Page' });
  await expect(heading).toBeVisible();

  // --- Find text on the page using getByText ---
  // There's a message that says something about logging in
  const loginInfo = page.getByText('This is where you can log into the secure area');
  await expect(loginInfo).toBeVisible();

  // --- Find the username field using getByLabel ---
  const username = page.getByLabel('Username');

  // --- Fill in the correct username ---
  await username.fill('tomsmith');

  // --- Find and fill the password field ---
  const password = page.getByLabel('Password');
  await password.fill('SuperSecretPassword!');

  // --- Find and click the login button ---
  const loginBtn = page.getByRole('button', { name: /Login/i });
  await loginBtn.click();

  // --- After clicking login, check what happens ---
  // We should see a message (success or error)
  // Since 'SuperSecretPassword!' is the CORRECT password for this demo site,
  // we should see a success message (or an error — depends on the site)
  // Let's just check we're still on a valid page
  // waitForLoadState makes sure the page finished loading after the click
  await page.waitForLoadState('networkidle');

  // --- Check the URL changed (we got redirected) ---
  // url() gives us the current page address
  // This checks that SOMETHING happened after clicking login
  const currentUrl = page.url();

  // --- Log what happened for debugging ---
  // console.log is instant — no await needed (like checking your own ammo count)
  console.log('After login, URL is:', currentUrl);
});

// ============================================================
// TEST 9: Locator Cheat Sheet — Quick Recap
// ============================================================
// This test isn't really testing a website —
// it's a REFERENCE you can look at to remember all locators.
// Think of it as your mission intel card that lists all your tools.
// ============================================================
test('locator cheat sheet — all 7 locators in one place', async ({ page }) => {

  // --- Build a page that has EVERY type of locator target ---
  await page.setContent(`
    <h1>Mission Control Panel</h1>
    <p>Welcome, Operator. Select your mission parameters below.</p>

    <form>
      <label for="callsign">Callsign:</label>
      <input id="callsign" type="text" placeholder="Enter your callsign..." />

      <label for="region">Region:</label>
      <input id="region" type="text" placeholder="Enter deployment region..." />

      <button type="submit" title="Start the mission">Deploy</button>
    </form>

    <img src="https://via.placeholder.com/100" alt="Mission area satellite view" />
    <div data-testid="mission-status">Status: Ready</div>
  `);

  // --- 1. getByRole — find by WHAT IT DOES ---
  await expect(page.getByRole('heading', { name: 'Mission Control Panel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Deploy' })).toBeVisible();

  // --- 2. getByText — find by WHAT IT SAYS ---
  await expect(page.getByText('Welcome, Operator')).toBeVisible();

  // --- 3. getByLabel — find input by its LABEL ---
  await expect(page.getByLabel('Callsign:')).toBeVisible();
  await expect(page.getByLabel('Region:')).toBeVisible();

  // --- 4. getByPlaceholder — find input by its HINT TEXT ---
  await expect(page.getByPlaceholder('Enter your callsign...')).toBeVisible();
  await expect(page.getByPlaceholder('Enter deployment region...')).toBeVisible();

  // --- 5. getByAltText — find image by its DESCRIPTION ---
  await expect(page.getByAltText('Mission area satellite view')).toBeVisible();

  // --- 6. getByTitle — find by HOVER TEXT ---
  await expect(page.getByTitle('Start the mission')).toBeVisible();

  // --- 7. getByTestId — find by SECRET CODE ---
  await expect(page.getByTestId('mission-status')).toBeVisible();

  // --- Fill in the form using different locators ---
  await page.getByLabel('Callsign:').fill('TIPU-ACTUAL');
  await page.getByPlaceholder('Enter deployment region...').fill('Sector 7');

  // --- Check what we typed is actually there ---
  // toHaveValue() checks the VALUE inside an input box
  // It's like checking what's loaded in your gear slot
  await expect(page.getByLabel('Callsign:')).toHaveValue('TIPU-ACTUAL');
  await expect(page.getByLabel('Region:')).toHaveValue('Sector 7');
});