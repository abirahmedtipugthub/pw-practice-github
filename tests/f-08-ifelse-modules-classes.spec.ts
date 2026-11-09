import { test, expect } from '@playwright/test';
// "Go to Playwright's toolbox and grab the test runner and assertion tools."

// ============================================
// F-08: if/else, Modules & Classes
// ============================================

// ==========================================
// PART 1: if/else — Mission Decision Points
// ==========================================

test('if/else - health check decision', async ({ page }) => {
  // "Start a test about if/else decisions."

  const health: number = 30;
  // "Make a variable called health, it's a number, set it to 30."

  let status: string;
  // "Make a variable called status, it will hold text. No value yet — we'll set it below."

  if (health > 75) {
    // "IF health is more than 75, do this:"
    status = 'Full strength — push forward';
  } else if (health > 25) {
    // "OTHERWISE, IF health is more than 25, do this instead:"
    status = 'Wounded — proceed with caution';
  } else {
    // "OTHERWISE (health is 25 or less), do this:"
    status = 'Critical — find cover and heal';
  }
  // "Only ONE of these three blocks runs. The first true condition wins."

  console.log('Health:', health, '→', status);
  // "Print: 'Health: 30 → Wounded — proceed with caution'"
  // "Because 30 is NOT > 75, but 30 IS > 25, so the second block runs."

  expect(status).toBe('Wounded — proceed with caution');
  // "I expect status to be this text. If not, test FAILS."
});

test('if/else - mission reward calculator', async ({ page }) => {
  // "Start a test about calculating mission rewards."

  const kills: number = 45;
  // "You got 45 kills this mission."

  const headshots: number = 12;
  // "12 of those were headshots."

  const missionComplete: boolean = true;
  // "You completed the mission objective."

  let reward: number = 0;
  // "Start with 0 reward points. We'll add to it."

  if (missionComplete) {
    // "IF missionComplete is true, do this."
    // "You don't need to write === true. Just the variable name works for booleans."
    reward = reward + 500;
    // "Add 500 base reward for completing the mission. reward is now 500."
  }

  if (kills > 30) {
    // "IF kills is more than 30, do this."
    // "This is a SEPARATE if — not else if. So it checks this no matter what happened above."
    reward = reward + 200;
    // "Add 200 bonus for high kill count. reward is now 700."
  }

  if (headshots > 10) {
    // "IF headshots is more than 10, do this."
    reward = reward + 150;
    // "Add 150 bonus for accuracy. reward is now 850."
  }

  console.log(`Mission reward: ${reward} points`);
  // "Print: 'Mission reward: 850 points'"

  expect(reward).toBe(850);
  // "I expect total reward to be 850."
});

test('if/else with Playwright - check page content', async ({ page }) => {
  // "Start a test that uses if/else with a real web page."

  await page.goto('https://example.com');
  // "Open example.com. Wait until it loads."

  const title: string = await page.title();
  // "Ask the page for its title. Wait for the answer. Store as text."

  if (title.includes('Example')) {
    // "IF the title contains the word 'Example', do this."
    // ".includes() checks if one text contains another text."
    console.log('We are on the right page!');
  } else {
    // "OTHERWISE, do this."
    console.log('Wrong page — something went wrong');
  }

  const linkCount: number = await page.locator('a').count();
  // "Find all links on the page. Count them. Store the number."

  if (linkCount > 0) {
    // "IF there is at least one link, do this."
    console.log(`Found ${linkCount} link(s) on the page`);
  } else {
    // "OTHERWISE (no links at all), do this."
    console.log('No links found on this page');
  }

  expect(title).toContain('Example');
  // "I expect the title to contain the word 'Example'. .toContain() = partial match."
});

// ==========================================
// PART 2: Modules — Importing Gear from Other Armouries
// ==========================================
// 
// HOW MODULES WORK (explained, not tested):
//
// Imagine you have a weapons armoury in a separate room.
// Instead of building every weapon inside each mission,
// you BUILD them once in the armoury, and IMPORT them when needed.
//
// --- THE ARMOURY FILE: utils/weapons.ts ---
//
//   export function getDamage(weapon: string): number {
//     // "export" means "other files can use this function"
//     // Without export, this function stays locked in this file only
//     if (weapon === 'AK-47') return 35;
//     if (weapon === 'Sniper') return 75;
//     if (weapon === 'Pistol') return 15;
//     return 0;
//   }
//
//   export const MAX_AMMO: number = 300;
//   // "You can export variables too, not just functions"
//
// --- THE MISSION FILE: tests/mission.spec.ts ---
//
//   import { getDamage, MAX_AMMO } from '../utils/weapons';
//   // "Go to the weapons armoury (one folder up, then into utils/weapons)
//   //  and grab the getDamage function and the MAX_AMMO variable."
//   //  '../' means go up one folder. './' means current folder.
//
//   console.log(getDamage('AK-47'));  // 35
//   console.log(MAX_AMMO);            // 300
//
// KEY RULES:
// - export = "I'm making this available for others"
// - import = "I'm grabbing this from another file"
// - You can only import what was exported
// - Path uses / not \ (even on Windows)
// - '../' = go up one folder, './' = same folder

test('modules concept - simulated import', async ({ page }) => {
  // "Since we can't easily demo imports in a single file,
  //  here's the same idea: a function defined once, used many times."

  // "This is like an armoury function — build once, use anywhere"
  function getDamage(weapon: string): number {
    // "Takes a weapon name (text), gives back damage (number)."
    if (weapon === 'AK-47') return 35;
    // "IF weapon is exactly 'AK-47', give back 35 and stop here."
    if (weapon === 'Sniper') return 75;
    // "IF weapon is exactly 'Sniper', give back 75 and stop here."
    if (weapon === 'Pistol') return 15;
    // "IF weapon is exactly 'Pistol', give back 15 and stop here."
    return 0;
    // "If none of the above matched, give back 0 (unknown weapon)."
  }

  console.log('AK-47 damage:', getDamage('AK-47'));
  // "Call the function with 'AK-47'. It returns 35. Print it."

  console.log('Sniper damage:', getDamage('Sniper'));
  // "Call the function with 'Sniper'. It returns 75. Print it."

  console.log('Unknown damage:', getDamage('Rock'));
  // "Call the function with 'Rock'. No match found, returns 0."

  expect(getDamage('AK-47')).toBe(35);
  expect(getDamage('Sniper')).toBe(75);
  expect(getDamage('Rock')).toBe(0);
});

// ==========================================
// PART 3: Classes — Soldier Blueprints
// ==========================================

test('classes - create a soldier from a blueprint', async ({ page }) => {
  // "Start a test about classes."

  class Soldier {
    // "class Soldier = a BLUEPRINT for making soldiers.
    //  It's not a soldier yet — it's the RECIPE for building one."

    name: string;
    // "Every soldier made from this blueprint will have a 'name' field (text)."

    health: number;
    // "Every soldier will have a 'health' field (number)."

    rank: string;
    // "Every soldier will have a 'rank' field (text)."

    constructor(name: string, health: number, rank: string) {
      // "constructor = the BUILDING PROCESS.
      //  When you create a new soldier, this runs automatically.
      //  It takes name, health, and rank as inputs."

      this.name = name;
      // "'this.name' = the soldier being built right now.
      //  So this.name = name means: set THIS soldier's name to the name that was given."

      this.health = health;
      // "Set THIS soldier's health to the health that was given."

      this.rank = rank;
      // "Set THIS soldier's rank to the rank that was given."
    }

    takeDamage(amount: number): void {
      // "A method (function inside a class). Takes damage amount, returns nothing (void).
      //  Every soldier built from this blueprint can use this."

      this.health = this.health - amount;
      // "Subtract the damage from THIS soldier's health."

      console.log(`${this.name} took ${amount} damage. Health: ${this.health}`);
      // "Print who got hit and their remaining health."
    }

    heal(amount: number): void {
      // "Another method. Adds health."

      this.health = this.health + amount;
      // "Add healing amount to THIS soldier's health."

      if (this.health > 100) {
        // "IF health goes above 100..."
        this.health = 100;
        // "Cap it at 100. Can't have more than max health."
      }

      console.log(`${this.name} healed. Health: ${this.health}`);
      // "Print who healed and their new health."
    }

    isAlive(): boolean {
      // "A method that returns true or false. 'Is this soldier still alive?'"

      return this.health > 0;
      // "If health is more than 0, return true. Otherwise return false."
    }
  }

  // --- BUILDING SOLDIERS FROM THE BLUEPRINT ---

  const tipu = new Soldier('Tipu', 100, 'Captain');
  // "'new Soldier(...)' = build a new soldier using the blueprint.
  //  This runs the constructor with name='Tipu', health=100, rank='Captain'.
  //  Now 'tipu' is a fully built soldier object."

  const ghost = new Soldier('Ghost', 100, 'Lieutenant');
  // "Build another soldier. Same blueprint, different values.
  //  That's the power of classes — one blueprint, many soldiers."

  console.log(`${tipu.name} (${tipu.rank}) - Health: ${tipu.health}`);
  // "Print: 'Tipu (Captain) - Health: 100'"

  console.log(`${ghost.name} (${ghost.rank}) - Health: ${ghost.health}`);
  // "Print: 'Ghost (Lieutenant) - Health: 100'"

  // --- USING METHODS ---

  tipu.takeDamage(30);
  // "Call takeDamage on the tipu soldier. Tipu's health: 100 - 30 = 70."

  tipu.takeDamage(50);
  // "Hit Tipu again. Health: 70 - 50 = 20."

  tipu.heal(40);
  // "Heal Tipu. Health: 20 + 40 = 60."

  ghost.takeDamage(95);
  // "Hit Ghost hard. Health: 100 - 95 = 5."

  console.log('Tipu alive?', tipu.isAlive());
  // "Check if Tipu is alive. Health is 60, which is > 0, so true."

  console.log('Ghost alive?', ghost.isAlive());
  // "Check if Ghost is alive. Health is 5, which is > 0, so true."

  expect(tipu.health).toBe(60);
  // "I expect Tipu's health to be 60 after all that damage and healing."

  expect(ghost.health).toBe(5);
  // "I expect Ghost's health to be 5."

  expect(tipu.isAlive()).toBe(true);
  expect(ghost.isAlive()).toBe(true);
});

test('classes - why they matter in Playwright', async ({ page }) => {
  // "This test shows HOW classes are used in real Playwright testing.
  //  In Playwright, you use classes to build 'Page Objects' (topic F-28).
  //  A Page Object = a class that represents one page of your website."

  // --- PAGE OBJECT EXAMPLE (simplified) ---
  class ExamplePage {
    // "A blueprint for interacting with example.com"

    private page: any;
    // "'private' means only this class can access this field.
    //  Outside code can't touch page directly — they use the methods below."

    constructor(page: any) {
      // "When you build an ExamplePage, you give it the Playwright page."
      this.page = page;
    }

    async open() {
      // "A method that opens the website."
      await this.page.goto('https://example.com');
      // "Navigate to example.com using the page we stored."
    }

    async getTitle(): Promise<string> {
      // "A method that gets the page title.
      //  Promise<string> means 'this will eventually give back text' (because it uses await)."
      return await this.page.title();
      // "Ask the page for its title and return it."
    }

    async getLinkCount(): Promise<number> {
      // "A method that counts links on the page."
      return await this.page.locator('a').count();
    }
  }

  // --- USING THE PAGE OBJECT ---

  const examplePage = new ExamplePage(page);
  // "Build an ExamplePage, give it the Playwright page."

  await examplePage.open();
  // "Call the open method. It goes to example.com."

  const title = await examplePage.getTitle();
  // "Call getTitle. It returns the page title."

  const links = await examplePage.getLinkCount();
  // "Call getLinkCount. It returns how many links are on the page."

  console.log('Page title:', title);
  console.log('Links on page:', links);

  expect(title).toBe('Example Domain');

  // "WHY THIS MATTERS:
  //  Without a Page Object, you write page.goto(), page.title() everywhere.
  //  With a Page Object, you write examplePage.open(), examplePage.getTitle().
  //  If the website changes, you update ONE class, not every test.
  //  This is what F-28 (Page Object Model) is all about."
});