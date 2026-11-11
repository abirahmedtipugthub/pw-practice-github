// ============================================================
// F-10: CSS & XPath Locators — The Backup Weapons
// ============================================================
// CoD Campaign Analogy:
// In F-09 you got your night-vision goggles (built-in locators).
// Those are your PRIMARY weapon — always use them first.
// But sometimes in a mission, your primary jams or doesn't work.
// That's when you pull out your BACKUP weapons:
//   CSS Selectors = your sidearm pistol (reliable, quick, good enough)
//   XPath         = your combat knife (precise, can do things others can't)
//
// CSS Selectors find elements using the same language that STYLES a webpage.
// XPath finds elements by walking through the page's family tree (HTML structure).
//
// RULE OF THUMB:
//   1st choice → Built-in locators (getByRole, getByText, etc.)
//   2nd choice → CSS Selectors (page.locator('css selector'))
//   3rd choice → XPath (page.locator('xpath expression'))
// ============================================================

// --- Load Playwright's test tools ---
import { test, expect } from '@playwright/test';

// ============================================================
// TEST 1: CSS — Select by Tag Name
// ============================================================
// CoD Analogy: "Find me ANY pistol" — you don't care which one,
// just grab any pistol from the armoury.
// Tag selectors find elements by their HTML tag name:
//   'h1' = find a heading
//   'p'  = find a paragraph
//   'a'  = find a link
//   'button' = find a button
// ============================================================
test('CSS — select by tag name', async ({ page }) => {

  // --- Build a mini page to practice on ---
  await page.setContent(`
    <h1>Mission Control</h1>
    <p>Welcome to base, Operator.</p>
    <button>Start Mission</button>
  `);

  // --- Find the <h1> tag using CSS ---
  // page.locator('h1') = "find me the element with tag name h1"
  // It's like saying "grab any pistol" — h1 is the tag name
  const heading = page.locator('h1');

  // --- Check it has the right text ---
  await expect(heading).toHaveText('Mission Control');

  // --- Find the <p> tag ---
  const paragraph = page.locator('p');
  await expect(paragraph).toHaveText('Welcome to base, Operator.');

  // --- Find the <button> tag ---
  const button = page.locator('button');
  await expect(button).toHaveText('Start Mission');
});

// ============================================================
// TEST 2: CSS — Select by ID (#)
// ============================================================
// CoD Analogy: Every soldier has a unique DOG TAG number.
// No two soldiers share the same number.
// An HTML element's "id" is its dog tag — unique on the whole page.
// In CSS, you use # (hash) before the id name to find it.
//   '#health-bar' = find the element whose id is "health-bar"
// ============================================================
test('CSS — select by ID using #', async ({ page }) => {

  // --- Build a page with elements that have IDs ---
  // id="..." is a UNIQUE name — only ONE element can have each id
  await page.setContent(`
    <div id="health-bar">Health: 100</div>
    <div id="ammo-count">Ammo: 250</div>
    <div id="score-display">Score: 5400</div>
  `);

  // --- Find the element with id="health-bar" ---
  // '#health-bar' = the # means "find by ID", then the id name
  // It's like saying "find the soldier with dog tag #health-bar"
  const health = page.locator('#health-bar');
  await expect(health).toHaveText('Health: 100');

  // --- Find by id="ammo-count" ---
  const ammo = page.locator('#ammo-count');
  await expect(ammo).toHaveText('Ammo: 250');

  // --- Find by id="score-display" ---
  const score = page.locator('#score-display');
  await expect(score).toHaveText('Score: 5400');
});

// ============================================================
// TEST 3: CSS — Select by Class (.)
// ============================================================
// CoD Analogy: Soldiers belong to SQUADS (wait — campaign terms!).
// Think of it like GEAR TYPES — all assault rifles share the
// label "assault-rifle" even though each gun is different.
// A "class" is a GROUP LABEL. Many elements can share the same class.
// In CSS, you use . (dot) before the class name.
//   '.weapon' = find elements with class "weapon"
// ============================================================
test('CSS — select by class using dot (.)', async ({ page }) => {

  // --- Build a page with elements that have classes ---
  // class="..." is a GROUP label — many elements can share it
  await page.setContent(`
    <div class="weapon">AK-47</div>
    <div class="weapon">M4A1</div>
    <div class="weapon">MP5</div>
    <div class="equipment">Frag Grenade</div>
    <div class="equipment">Flashbang</div>
  `);

  // --- Find ALL elements with class "weapon" ---
  // '.weapon' = the dot means "find by CLASS", then the class name
  // This finds ALL THREE weapon divs (not just one!)
  const weapons = page.locator('.weapon');

  // --- Check there are 3 weapons ---
  // count() returns how many elements matched
  await expect(weapons).toHaveCount(3);

  // --- Check the first weapon's text ---
  // .first() = grab the FIRST one from the group
  await expect(weapons.first()).toHaveText('AK-47');

  // --- Check the last weapon's text ---
  // .last() = grab the LAST one from the group
  await expect(weapons.last()).toHaveText('MP5');

  // --- Find all equipment items ---
  const equipment = page.locator('.equipment');
  await expect(equipment).toHaveCount(2);
});

// ============================================================
// TEST 4: CSS — Select by Attribute ([attribute="value"])
// ============================================================
// CoD Analogy: Finding gear by a SPECIFIC MARKING on it.
// Like finding the radio tuned to frequency "channel-5"
// or the weapon with serial number "W-4421".
// In CSS, square brackets [] let you match any attribute.
//   '[type="text"]' = find elements where type equals "text"
//   '[data-weapon="ak47"]' = find elements with data-weapon="ak47"
// ============================================================
test('CSS — select by attribute value', async ({ page }) => {

  // --- Build a page with various attributes ---
  await page.setContent(`
    <input type="text" placeholder="Enter callsign" />
    <input type="password" placeholder="Enter access code" />
    <input type="email" placeholder="Enter comms address" />
    <button data-action="deploy">Deploy</button>
    <button data-action="abort">Abort Mission</button>
  `);

  // --- Find the text input using [type="text"] ---
  // '[type="text"]' = "find the element where the type attribute equals text"
  // Square brackets = attribute selector
  const textInput = page.locator('[type="text"]');
  await expect(textInput).toBeVisible();

  // --- Find the password input ---
  const passwordInput = page.locator('[type="password"]');
  await expect(passwordInput).toBeVisible();

  // --- Find the button with data-action="deploy" ---
  // data-* attributes are custom attributes developers add
  // They're like custom markings on gear
  const deployButton = page.locator('[data-action="deploy"]');
  await expect(deployButton).toHaveText('Deploy');

  // --- Find the abort button ---
  const abortButton = page.locator('[data-action="abort"]');
  await expect(abortButton).toHaveText('Abort Mission');
});

// ============================================================
// TEST 5: CSS — Combining Selectors (Tag + Class + ID)
// ============================================================
// CoD Analogy: Sometimes you need to be MORE SPECIFIC:
//   "Find me a pistol" → too vague, many pistols
//   "Find me the GOLD pistol" → tag + class
//   "Find me the gold pistol with serial #P-007" → tag + class + id
// You can combine CSS selectors to narrow down your search.
// ============================================================
test('CSS — combining selectors for precision', async ({ page }) => {

  // --- Build a page with mixed elements ---
  await page.setContent(`
    <div class="soldier">Private Jones</div>
    <div class="soldier captain">Captain Price</div>
    <span class="soldier">Sergeant Ghost</span>
    <div class="vehicle">Humvee</div>
    <div id="team-lead" class="soldier">Commander Tipu</div>
  `);

  // --- Combine tag + class ---
  // 'div.soldier' = "find a <div> that ALSO has class soldier"
  // This skips the <span> with class soldier — only divs!
  // It's like saying "find me an ASSAULT RIFLE (div) that's also SILENCED (soldier)"
  const divSoldiers = page.locator('div.soldier');

  // --- There are 3 divs with class soldier (not the span) ---
  await expect(divSoldiers).toHaveCount(3);

  // --- Combine tag + id ---
  // 'div#team-lead' = "find a <div> with id team-lead"
  const teamLead = page.locator('div#team-lead');
  await expect(teamLead).toHaveText('Commander Tipu');

  // --- Multiple classes ---
  // '.soldier.captain' = "find element that has BOTH classes: soldier AND captain"
  // It's like finding gear that is BOTH a weapon AND silenced
  const captain = page.locator('.soldier.captain');
  await expect(captain).toHaveText('Captain Price');
});

// ============================================================
// TEST 6: CSS — Parent > Child Selector
// ============================================================
// CoD Analogy: Your base has ROOMS, and each room has ITEMS.
// "Find the weapon inside the armoury room"
// The > symbol means "direct child" — look INSIDE this container.
//   '#armoury > .weapon' = "inside #armoury, find a .weapon"
// ============================================================
test('CSS — parent > child selector', async ({ page }) => {

  // --- Build a page with nested structure ---
  // Think of divs as ROOMS and the items inside as GEAR
  await page.setContent(`
    <div id="armoury">
      <div class="weapon">AK-47</div>
      <div class="weapon">M4A1</div>
    </div>
    <div id="med-bay">
      <div class="item">First Aid Kit</div>
      <div class="item">Bandage</div>
    </div>
    <div class="weapon">Random Outside Weapon</div>
  `);

  // --- Find weapons INSIDE the armoury only ---
  // '#armoury > .weapon' = "inside the armoury room, find weapons"
  // The > means DIRECT child — only weapons directly inside armoury
  // This will NOT find "Random Outside Weapon" because it's not in the armoury
  const armouryWeapons = page.locator('#armoury > .weapon');
  await expect(armouryWeapons).toHaveCount(2);

  // --- Find items inside med-bay ---
  const medBayItems = page.locator('#med-bay > .item');
  await expect(medBayItems).toHaveCount(2);
  await expect(medBayItems.first()).toHaveText('First Aid Kit');

  // --- All weapons on the page (including outside ones) ---
  const allWeapons = page.locator('.weapon');
  await expect(allWeapons).toHaveCount(3); // 2 in armoury + 1 outside
});

// ============================================================
// TEST 7: XPath — The Basics
// ============================================================
// CoD Analogy: XPath is like reading a MAP with directions:
//   "Go to the building (//div), find the room called armoury,
//    then grab the first weapon on the shelf"
// XPath uses / (slashes) like folder paths on a computer.
// It starts with // which means "search anywhere on the page".
//   '//h1'           = find any <h1> anywhere
//   '//div[@id="x"]' = find a div where id equals "x"
//   '//button[text()="Click"]' = find button with exact text "Click"
// ============================================================
test('XPath — basic element finding', async ({ page }) => {

  // --- Build a practice page ---
  await page.setContent(`
    <h1>Operation Dark Storm</h1>
    <div id="briefing">
      <p>Infiltrate the enemy compound.</p>
      <p>Extract the intel package.</p>
    </div>
    <button>Accept Mission</button>
    <button>Decline</button>
  `);

  // --- Find <h1> using XPath ---
  // '//h1' = "search the whole page for any h1 element"
  // The // means "search anywhere" (like a global search)
  const heading = page.locator('//h1');
  await expect(heading).toHaveText('Operation Dark Storm');

  // --- Find div by ID using XPath ---
  // '//div[@id="briefing"]' = "find a div where the id attribute equals briefing"
  // @ means "attribute" in XPath
  // It's like reading a map: "find the building marked 'briefing'"
  const briefing = page.locator('//div[@id="briefing"]');
  await expect(briefing).toBeVisible();

  // --- Find button by its text using XPath ---
  // '//button[text()="Accept Mission"]' = "find a button whose text says exactly this"
  // text() in XPath = the visible text inside the element
  const acceptBtn = page.locator('//button[text()="Accept Mission"]');
  await expect(acceptBtn).toBeVisible();

  // --- Find all <p> tags inside the briefing div ---
  // '//div[@id="briefing"]/p' = "inside the briefing div, find all <p> tags"
  // Single / means "direct child" (same as > in CSS)
  const briefingLines = page.locator('//div[@id="briefing"]/p');
  await expect(briefingLines).toHaveCount(2);
});

// ============================================================
// TEST 8: XPath — contains() for Partial Text Match
// ============================================================
// CoD Analogy: Sometimes you don't know the FULL name of a target.
// You just know part of it — "the guy with 'Storm' in his codename."
// XPath's contains() finds elements that CONTAIN certain text.
// ============================================================
test('XPath — contains() for partial matching', async ({ page }) => {

  // --- Build a page with various text ---
  await page.setContent(`
    <div class="mission">Operation Thunder Strike</div>
    <div class="mission">Operation Silent Storm</div>
    <div class="mission">Operation Desert Eagle</div>
    <p class="status">Mission Status: Active</p>
    <p class="status">Base Status: Secure</p>
  `);

  // --- Find element that CONTAINS the word "Silent" ---
  // '//div[contains(text(), "Silent")]' =
  //   "find a div whose text contains the word 'Silent' somewhere"
  // contains() is like a search — finds partial matches
  const silentMission = page.locator('//div[contains(text(), "Silent")]');
  await expect(silentMission).toHaveText('Operation Silent Storm');

  // --- Find all elements containing "Status" ---
  // '//*[contains(text(), "Status")]' =
  //   * means ANY element type (div, p, span, anything)
  //   "find any element whose text contains 'Status'"
  const statusElements = page.locator('//*[contains(text(), "Status")]');
  await expect(statusElements).toHaveCount(2);

  // --- Find element containing "Desert" ---
  const desertMission = page.locator('//div[contains(text(), "Desert")]');
  await expect(desertMission).toHaveText('Operation Desert Eagle');
});

// ============================================================
// TEST 9: CSS vs XPath vs Built-in — Same Target, Three Ways
// ============================================================
// CoD Analogy: Three weapons, one target. You can take down
// the same enemy with your rifle, pistol, or knife.
// This test shows how the SAME element can be found
// using all three approaches.
// ============================================================
test('three ways to find the same element', async ({ page }) => {

  // --- Build a page with a login form ---
  await page.setContent(`
    <h2>Secure Area Login</h2>
    <form id="login-form">
      <label for="username">Username:</label>
      <input id="username" type="text" placeholder="Enter your codename" />
      <button type="submit" class="btn-primary">Login</button>
    </form>
  `);

  // ==============================
  // FINDING THE HEADING — 3 ways:
  // ==============================

  // --- Way 1: Built-in (BEST — always try this first) ---
  // getByRole is the cleanest, most readable way
  const heading1 = page.getByRole('heading', { name: 'Secure Area Login' });
  await expect(heading1).toBeVisible();

  // --- Way 2: CSS Selector (backup) ---
  // Uses the tag name directly
  const heading2 = page.locator('h2');
  await expect(heading2).toHaveText('Secure Area Login');

  // --- Way 3: XPath (last resort) ---
  // Uses the XPath path syntax
  const heading3 = page.locator('//h2');
  await expect(heading3).toHaveText('Secure Area Login');

  // ==============================
  // FINDING THE INPUT — 3 ways:
  // ==============================

  // --- Way 1: Built-in (BEST) ---
  const input1 = page.getByLabel('Username:');
  await expect(input1).toBeVisible();

  // --- Way 2: CSS — by ID ---
  const input2 = page.locator('#username');
  await expect(input2).toBeVisible();

  // --- Way 3: XPath — by attribute ---
  const input3 = page.locator('//input[@id="username"]');
  await expect(input3).toBeVisible();

  // ==============================
  // FINDING THE BUTTON — 3 ways:
  // ==============================

  // --- Way 1: Built-in (BEST) ---
  const button1 = page.getByRole('button', { name: 'Login' });
  await expect(button1).toBeVisible();

  // --- Way 2: CSS — by class ---
  const button2 = page.locator('button.btn-primary');
  await expect(button2).toHaveText('Login');

  // --- Way 3: XPath — by text ---
  const button3 = page.locator('//button[text()="Login"]');
  await expect(button3).toHaveText('Login');
});

// ============================================================
// TEST 10: Real Mission — Login Page with CSS & XPath
// ============================================================
// CoD Analogy: Full mission using your backup weapons.
// Sometimes the built-in locators don't work on a real website
// (the HTML is messy, no labels, no test IDs).
// That's when CSS and XPath save the day.
// ============================================================
test('real mission — login page with CSS and XPath', async ({ page }) => {

  // --- Go to a real login page ---
  await page.goto('https://the-internet.herokuapp.com/login');

  // --- Find the heading using CSS tag selector ---
  const heading = page.locator('h2');
  await expect(heading).toBeVisible();

  // --- Find the username input using CSS ID selector ---
  // The page has <input id="username"> so we use #username
  const username = page.locator('#username');

  // --- Type the username ---
  await username.fill('tomsmith');

  // --- Find the password input using CSS ID selector ---
  const password = page.locator('#password');

  // --- Type the password ---
  await password.fill('SuperSecretPassword!');

  // --- Find the login button using CSS class + tag ---
  // The button has a class, so we find it by tag + a CSS selector
  const loginButton = page.locator('button[type="submit"]');

  // --- Click login ---
  await loginButton.click();

  // --- Wait for page to load after login ---
  await page.waitForLoadState('networkidle');

  // --- Check we're on the secure page (URL changed) ---
  // toContain checks if the URL has this text somewhere in it
  await expect(page).toHaveURL(/.*secure/);

  // --- Find the success/error message using XPath ---
  // The flash message has id="flash"
  const flashMessage = page.locator('#flash');
  await expect(flashMessage).toBeVisible();

  // --- Log what the message says ---
  const messageText = await flashMessage.textContent();
  console.log('Login result:', messageText?.trim());
});