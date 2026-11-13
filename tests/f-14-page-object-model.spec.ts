// ============================================================
// F-14: Page Object Model (POM) — Mission Playbook
// ============================================================
// CoD Campaign Analogy:
// In earlier missions, you did EVERYTHING yourself:
//   find the door, open it, check inside, clear the room.
// But in a REAL operation, the team uses a PLAYBOOK:
//   "Room Clearing Playbook" — step 1: breach, step 2: flashbang, step 3: clear
//   "Vehicle Extraction Playbook" — step 1: signal, step 2: board, step 3: go
//
// A Page Object is a PLAYBOOK for one page of a website.
// It stores:
//   - WHERE things are on the page (locators)
//   - HOW to do things on the page (methods/actions)
//
// Why? Because if the website changes, you update ONE playbook,
// not every single test that uses that page.
//
// WITHOUT POM: Every test has page.locator('#username').fill(...)
//   → If the ID changes, you fix 50 tests!
//
// WITH POM: Tests call loginPage.enterUsername(...)
//   → If the ID changes, you fix ONE place in the playbook!
//
// STRUCTURE:
//   Page Object class = the playbook (knows the page)
//   Test file = the mission (uses the playbook)
//
// In real projects, Page Objects go in a separate file.
// For learning, we'll put everything in ONE file first.
// ============================================================

// --- Load Playwright's test tools ---
import { test, expect, Page } from '@playwright/test';

// ============================================================
// PAGE OBJECT 1: LoginPage — Playbook for the Login Page
// ============================================================
// This class knows EVERYTHING about the login page:
//   - Where the username field is
//   - Where the password field is
//   - Where the login button is
//   - How to log in
//   - How to check if login worked
// ============================================================

class LoginPage {
  // --- These are the PROPERTIES — the page and its elements ---
  // Think of these as the KNOWN POSITIONS on your mission map
  // "The username field is HERE, the password field is HERE"

  // 'page' is the browser page we're working with
  // It's like the MAP of the current area
  readonly page: Page;

  // 'private' means only THIS class can use these directly
  // It's like classified intel — only the playbook knows the exact positions

  constructor(page: Page) {
    // --- The constructor runs when you CREATE a new LoginPage ---
    // It's like opening the playbook and saying "this is the area we're in"
    // page = the browser page that Playwright gives us
    this.page = page;
  }

  // ========== LOCATORS — Where things are ==========
  // These are METHODS that return locators
  // Think of them as "look up position X in the playbook"

  // --- Method to get the username field ---
  // This returns the locator (position) of the username input
  usernameField() {
    return this.page.locator('#username');
  }

  // --- Method to get the password field ---
  passwordField() {
    return this.page.locator('#password');
  }

  // --- Method to get the login button ---
  loginButton() {
    return this.page.locator('button[type="submit"]');
  }

  // --- Method to get the flash message (success/error) ---
  flashMessage() {
    return this.page.locator('#flash');
  }

  // ========== ACTIONS — How to do things ==========
  // These are the STEPS in the playbook

  // --- Navigate to the login page ---
  // It's like the first step in the playbook: "Go to this location"
  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/login');
  }

  // --- Enter the username ---
  // username: string = the username to type (you provide it)
  async enterUsername(username: string) {
    await this.usernameField().fill(username);
  }

  // --- Enter the password ---
  async enterPassword(password: string) {
    await this.passwordField().fill(password);
  }

  // --- Click the login button ---
  async clickLogin() {
    await this.loginButton().click();
  }

  // --- Do the FULL login in one step ---
  // This combines multiple steps into one easy command
  // It's like a macro: "execute full login sequence"
  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  // ========== ASSERTIONS — Verify things ==========
  // These check if things are correct

  // --- Check if login was successful ---
  async expectLoginSuccess() {
    await expect(this.flashMessage()).toContainText('You logged into a secure area!');
  }

  // --- Check if login failed ---
  async expectLoginFailure() {
    await expect(this.flashMessage()).toContainText('Your username is invalid!');
  }

  // --- Check the page heading ---
  async expectHeading(text: string) {
    await expect(this.page.getByRole('heading', { name: text })).toBeVisible();
  }
}

// ============================================================
// TEST 1: Using the Page Object — Clean Login Test
// ============================================================
// CoD Analogy: Instead of figuring out every step yourself,
// you just FOLLOW THE PLAYBOOK. The playbook handles the details.
// Look how CLEAN and READABLE this test is!
// ============================================================
test('POM — clean login using page object', async ({ page }) => {

  // --- Create a new LoginPage playbook for this browser page ---
  // This is like opening the playbook and saying "use this for our current mission"
  const loginPage = new LoginPage(page);

  // --- Step 1: Go to the login page ---
  await loginPage.goto();

  // --- Step 2: Verify we're on the right page ---
  await loginPage.expectHeading('Login Page');

  // --- Step 3: Login with valid credentials ---
  // ONE LINE does the entire login! Clean and simple.
  await loginPage.login('tomsmith', 'SuperSecretPassword!');

  // --- Step 4: Wait for navigation ---
  await page.waitForURL('**/secure');

  // --- Step 5: Verify login succeeded ---
  await loginPage.expectLoginSuccess();
});

// ============================================================
// TEST 2: Same Page Object, Different Test
// ============================================================
// CoD Analogy: Same playbook, different mission parameters.
// The LOGIN playbook works whether you're logging in as
// an admin, a soldier, or trying wrong credentials.
// ============================================================
test('POM — failed login using same page object', async ({ page }) => {

  // --- Same playbook, different mission ---
  const loginPage = new LoginPage(page);

  // --- Go to login page ---
  await loginPage.goto();

  // --- Try wrong credentials ---
  await loginPage.login('wronguser', 'wrongpassword');

  // --- Should show error message ---
  await loginPage.expectLoginFailure();
});

// ============================================================
// TEST 3: Step-by-Step Login Using Individual Methods
// ============================================================
// Sometimes you want to test INDIVIDUAL STEPS, not the whole login.
// The playbook lets you use single steps OR the full sequence.
// ============================================================
test('POM — using individual steps from the playbook', async ({ page }) => {

  const loginPage = new LoginPage(page);
  await loginPage.goto();

  // --- Step by step (not using the combined login() method) ---
  // This is useful when you want to CHECK things between steps

  // --- Enter username and verify ---
  await loginPage.enterUsername('tomsmith');
  await expect(loginPage.usernameField()).toHaveValue('tomsmith');

  // --- Enter password and verify ---
  await loginPage.enterPassword('SuperSecretPassword!');
  await expect(loginPage.passwordField()).toHaveValue('SuperSecretPassword!');

  // --- Check button is enabled before clicking ---
  await expect(loginPage.loginButton()).toBeEnabled();

  // --- Click login ---
  await loginPage.clickLogin();

  // --- Verify success ---
  await page.waitForURL('**/secure');
  await loginPage.expectLoginSuccess();
});

// ============================================================
// PAGE OBJECT 2: TodoPage — Playbook for a To-Do App
// ============================================================
// A SECOND example to show POM works for ANY page type.
// This playbook knows how to manage a to-do list.
// ============================================================

class TodoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ========== LOCATORS ==========

  // --- The input box where you type new to-dos ---
  newTodoInput() {
    return this.page.getByPlaceholder('What needs to be done?');
  }

  // --- All the to-do items in the list ---
  todoItems() {
    return this.page.locator('.todo-list li');
  }

  // --- The count text at the bottom (e.g., "2 items left") ---
  todoCount() {
    return this.page.locator('.todo-count');
  }

  // ========== ACTIONS ==========

  // --- Navigate to the to-do app ---
  async goto() {
    await this.page.goto('https://demo.playwright.dev/todomvc/#/');
  }

  // --- Add a new to-do item ---
  // text: string = what to add to the list
  async addTodo(text: string) {
    await this.newTodoInput().fill(text);
    await this.newTodoInput().press('Enter');
  }

  // --- Add MULTIPLE to-do items at once ---
  // items: string[] = an array of texts to add
  async addMultipleTodos(items: string[]) {
    // Loop through each item and add it
    for (const item of items) {
      await this.addTodo(item);
    }
  }

  // --- Complete (check off) a to-do by its text ---
  async completeTodo(text: string) {
    // Find the to-do item that contains this text
    // Then find the checkbox inside it and check it
    const todoItem = this.page.locator('.todo-list li').filter({ hasText: text });
    await todoItem.locator('.toggle').check();
  }

  // --- Delete a to-do by its text ---
  async deleteTodo(text: string) {
    const todoItem = this.page.locator('.todo-list li').filter({ hasText: text });
    // Hover first to reveal the delete button (X)
    await todoItem.hover();
    await todoItem.locator('.destroy').click();
  }

  // ========== ASSERTIONS ==========

  // --- Check how many to-dos are in the list ---
  async expectTodoCount(count: number) {
    await expect(this.todoItems()).toHaveCount(count);
  }

  // --- Check the "items left" counter text ---
  async expectItemsLeft(count: number) {
    const text = count === 1 ? '1 item left' : `${count} items left`;
    await expect(this.todoCount()).toContainText(text);
  }

  // --- Check a specific to-do exists ---
  async expectTodoExists(text: string) {
    await expect(this.page.getByText(text, { exact: true })).toBeVisible();
  }
}

// ============================================================
// TEST 4: TodoPage POM — Adding Items
// ============================================================
test('POM — adding to-do items', async ({ page }) => {
  test.setTimeout(60000);

  // --- Create the TodoPage playbook ---
  const todoPage = new TodoPage(page);

  // --- Navigate to the app ---
  await todoPage.goto();
  // --- Add some mission tasks ---
  await todoPage.addTodo('Complete F-14 Page Object Model');
  await todoPage.addTodo('Push to GitHub');
  await todoPage.addTodo('Create Pull Request');

  // --- Verify 3 items exist ---
  await todoPage.expectTodoCount(3);
  await todoPage.expectItemsLeft(3);

  // --- Check each item is on the list ---
  await todoPage.expectTodoExists('Complete F-14 Page Object Model');
  await todoPage.expectTodoExists('Push to GitHub');
  await todoPage.expectTodoExists('Create Pull Request');
});

// ============================================================
// TEST 5: TodoPage POM — Completing and Deleting Items
// ============================================================
test('POM — completing and deleting to-dos', async ({ page }) => {
  test.setTimeout(60000);

  const todoPage = new TodoPage(page);
  await todoPage.goto();

  // --- Add mission tasks ---
  await todoPage.addMultipleTodos([
    'Gather intel',
    'Plan the breach',
    'Execute mission',
    'Extract safely'
  ]);

  // --- Verify all 4 are there ---
  await todoPage.expectTodoCount(4);

  // --- Complete "Gather intel" (check it off) ---
  await todoPage.completeTodo('Gather intel');

  // --- Items left should now be 3 (one completed) ---
  await todoPage.expectItemsLeft(3);

  // --- Complete another one ---
  await todoPage.completeTodo('Plan the breach');
  await todoPage.expectItemsLeft(2);

  // --- Delete "Extract safely" ---
  await todoPage.deleteTodo('Extract safely');

  // --- Now there should be 3 items total (one was deleted) ---
  await todoPage.expectTodoCount(3);
});

// ============================================================
// TEST 6: POM Without a Website — Testing the Pattern
// ============================================================
// This test uses setContent() to show POM works on ANY page,
// even one you build yourself. The pattern is always the same.
// ============================================================

// --- A simple Page Object for a mission setup form ---
class MissionSetupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // --- Locators ---
  operatorNameInput() { return this.page.locator('#operator-name'); }
  missionTypeSelect() { return this.page.locator('#mission-type'); }
  nightOpCheckbox() { return this.page.locator('#night-op'); }
  deployButton() { return this.page.locator('#deploy-btn'); }
  resultDisplay() { return this.page.locator('#result'); }

  // --- Actions ---
  async setOperatorName(name: string) {
    await this.operatorNameInput().fill(name);
  }

  async selectMissionType(value: string) {
    await this.missionTypeSelect().selectOption(value);
  }

  async enableNightOp() {
    await this.nightOpCheckbox().check();
  }

  async deploy() {
    await this.deployButton().click();
  }

  // --- Full setup and deploy in one call ---
  async setupAndDeploy(name: string, missionType: string, nightOp: boolean) {
    await this.setOperatorName(name);
    await this.selectMissionType(missionType);
    if (nightOp) {
      await this.enableNightOp();
    }
    await this.deploy();
  }

  // --- Assertions ---
  async expectResult(text: string) {
    await expect(this.resultDisplay()).toContainText(text);
  }
}

test('POM — custom page with mission setup form', async ({ page }) => {

  // --- Build the page ---
  await page.setContent(`
    <h1>Mission Setup</h1>
    <label for="operator-name">Operator:</label>
    <input id="operator-name" type="text" />

    <label for="mission-type">Type:</label>
    <select id="mission-type">
      <option value="">-- Select --</option>
      <option value="recon">Recon</option>
      <option value="assault">Assault</option>
      <option value="stealth">Stealth</option>
    </select>

    <label><input type="checkbox" id="night-op" /> Night Op</label>
    <button id="deploy-btn">Deploy</button>
    <div id="result"></div>
    <script>
      document.getElementById('deploy-btn').addEventListener('click', () => {
        const name = document.getElementById('operator-name').value;
        const type = document.getElementById('mission-type').value;
        const night = document.getElementById('night-op').checked;
        let result = name + ' on ' + type + ' mission';
        if (night) result += ' (Night Op)';
        document.getElementById('result').textContent = result;
      });
    </script>
  `);

  // --- Use the Page Object ---
  const missionPage = new MissionSetupPage(page);

  // --- Setup and deploy in ONE line ---
  await missionPage.setupAndDeploy('TIPU', 'stealth', true);

  // --- Verify the result ---
  await missionPage.expectResult('TIPU');
  await missionPage.expectResult('stealth');
  await missionPage.expectResult('Night Op');
});

// ============================================================
// TEST 7: Why POM Matters — The Real Benefit
// ============================================================
// This test shows the SAME LoginPage used AGAIN.
// If the website changes its login form, we only change
// the LoginPage class — not every test!
// ============================================================
test('POM — reusing the same playbook in another test', async ({ page }) => {

  const loginPage = new LoginPage(page);

  // --- Go to login ---
  await loginPage.goto();

  // --- Check the page is ready ---
  await expect(loginPage.usernameField()).toBeVisible();
  await expect(loginPage.passwordField()).toBeVisible();
  await expect(loginPage.loginButton()).toBeEnabled();

  // --- Login ---
  await loginPage.login('tomsmith', 'SuperSecretPassword!');
  await page.waitForURL('**/secure');

  // --- Verify ---
  await loginPage.expectLoginSuccess();
  await expect(page).toHaveURL(/secure/);

  // --- Notice: We reused LoginPage with ZERO code duplication!
  // The locators and methods are defined ONCE in the class.
  // Every test just calls the playbook methods.
  console.log('POM demonstration complete — same playbook, multiple missions!');
});