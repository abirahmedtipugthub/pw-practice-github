import { test, expect } from '@playwright/test';
// "Go to Playwright's toolbox and grab the 'test' and 'expect' tools"

// ============================================
// F-07: Arrays, Objects & Loops
// ============================================

test('arrays - weapon wheel', async ({ page }) => {
  // "Start a test called 'arrays - weapon wheel'"

  const weapons: string[] = ['AK-47', 'M4A1', 'Sniper', 'Shotgun'];
  // "Make a list called 'weapons' that holds text items. Put these 4 guns in it."

  console.log('First weapon:', weapons[0]);
  // "Print the first item in the list. [0] means position zero = first item."

  console.log('Third weapon:', weapons[2]);
  // "Print the third item. [2] = position two = third item (counting starts from 0)."

  console.log('Total weapons:', weapons.length);
  // "Print how many items are in the list. .length = count of items."

  weapons.push('RPG');
  // "Add 'RPG' at the end of the list. Push = shove it in at the back."

  console.log('After push:', weapons);
  // "Print the whole list to see RPG was added."

  weapons.pop();
  // "Remove the last item from the list. Pop = pull out the last one."

  console.log('After pop:', weapons);
  // "Print the list again — RPG is gone, back to 4 items."

  const hasSniper: boolean = weapons.includes('Sniper');
  // "Check if 'Sniper' exists in the list. Store the answer (true or false) in hasSniper."

  console.log('Has Sniper?', hasSniper);
  // "Print whether we found a Sniper or not."

  expect(weapons.length).toBe(4);
  // "I expect the list to have exactly 4 items. If not, test FAILS."

  expect(weapons[0]).toBe('AK-47');
  // "I expect the first item to be 'AK-47'. If not, test FAILS."

  expect(hasSniper).toBe(true);
  // "I expect hasSniper to be true. If not, test FAILS."
});

test('objects - player profile card', async ({ page }) => {
  // "Start a test called 'objects - player profile card'"

  const player = {
    name: 'Tipu',
    rank: 'Captain',
    kills: 25,
    isAlive: true,
    weapons: ['AK-47', 'M4A1'],
  };
  // "Make a profile card called 'player' with these fields:
  //   name is Tipu
  //   rank is Captain
  //   kills is 25
  //   isAlive is true
  //   weapons is a list with AK-47 and M4A1"

  console.log('Name:', player.name);
  // "Print the name field from the player card. player.name = go to player, read the name."

  console.log('Rank:', player.rank);
  // "Print the rank field."

  console.log('Kills:', player.kills);
  // "Print the kills field."

  console.log('Weapons:', player.weapons);
  // "Print the weapons field (which is a list inside the profile card)."

  player.kills = 30;
  // "Change the kills field from 25 to 30. Like updating the scoreboard after a mission."

  console.log('Updated kills:', player.kills);
  // "Print kills again to see it changed to 30."

  expect(player.name).toBe('Tipu');
  // "I expect name to be 'Tipu'."

  expect(player.kills).toBe(30);
  // "I expect kills to be 30 (the updated number, not the old 25)."

  expect(player.weapons.length).toBe(2);
  // "I expect the weapons list inside the player card to have 2 items."
});

test('for loop - patrol rounds', async ({ page }) => {
  // "Start a test called 'for loop - patrol rounds'"

  const rounds: string[] = [];
  // "Make an empty list called 'rounds'. Nothing in it yet."

  for (let i = 0; i < 5; i++) {
    // "Start a counter called 'i' at 0.
    //  Keep going as long as i is less than 5.
    //  After each round, add 1 to i.
    //  So it runs: i=0, i=1, i=2, i=3, i=4 then stops."

    console.log('Patrol round:', i);
    // "Print which round number we're on."

    rounds.push(`Round ${i}`);
    // "Add 'Round 0', 'Round 1', etc. to the list.
    //  The backtick ` ` lets you put variables inside text using ${}.
    //  So when i=0, `Round ${i}` becomes 'Round 0'."
  }

  expect(rounds.length).toBe(5);
  // "I expect we completed 5 rounds."

  expect(rounds[0]).toBe('Round 0');
  // "I expect the first round to be 'Round 0'."

  expect(rounds[4]).toBe('Round 4');
  // "I expect the last round to be 'Round 4'."
});

test('for...of loop - checking each weapon', async ({ page }) => {
  // "Start a test called 'for...of loop - checking each weapon'"

  const weapons: string[] = ['AK-47', 'M4A1', 'Sniper'];
  // "Make a list with 3 weapons."

  const inspected: string[] = [];
  // "Make an empty list to track which weapons we've checked."

  for (const weapon of weapons) {
    // "Go through the weapons list one by one.
    //  Each time, put the current item into a variable called 'weapon'.
    //  First time: weapon = 'AK-47'
    //  Second time: weapon = 'M4A1'
    //  Third time: weapon = 'Sniper'
    //  Then it stops because the list is done."

    console.log('Inspecting:', weapon);
    // "Print which weapon we're currently looking at."

    inspected.push(weapon);
    // "Add this weapon to the inspected list."
  }

  expect(inspected.length).toBe(3);
  // "I expect we inspected 3 weapons."

  expect(inspected).toEqual(weapons);
  // "I expect the inspected list to have the same items as the weapons list.
  //  .toEqual() compares the CONTENTS of two lists.
  //  .toBe() only works for simple values like numbers and text."
});

test('forEach - mission briefing for each soldier', async ({ page }) => {
  // "Start a test called 'forEach - mission briefing for each soldier'"

  const soldiers: string[] = ['Alpha', 'Bravo', 'Charlie'];
  // "Make a list of 3 soldier names."

  soldiers.forEach((soldier, index) => {
    // "Go through each soldier in the list.
    //  'soldier' = the current name (Alpha, then Bravo, then Charlie)
    //  'index' = what position they're at (0, 1, 2)
    //  This does the same thing as for...of, just written differently."

    console.log(`Soldier ${index + 1}: ${soldier}`);
    // "Print 'Soldier 1: Alpha', 'Soldier 2: Bravo', 'Soldier 3: Charlie'.
    //  index + 1 because index starts at 0, but we want to show 1, 2, 3."
  });

  expect(soldiers.length).toBe(3);
  // "I expect 3 soldiers in the list."
});

test('array of objects - full squad intel', async ({ page }) => {
  // "Start a test called 'array of objects - full squad intel'"

  const squad = [
    { name: 'Tipu', role: 'Captain', kills: 25 },
    { name: 'Ghost', role: 'Sniper', kills: 40 },
    { name: 'Soap', role: 'Assault', kills: 35 },
  ];
  // "Make a list called 'squad'. Each item in the list is a profile card.
  //  So squad[0] = Tipu's card, squad[1] = Ghost's card, squad[2] = Soap's card."

  for (const soldier of squad) {
    // "Go through each soldier's profile card one by one."

    console.log(`${soldier.name} (${soldier.role}) - ${soldier.kills} kills`);
    // "Print: 'Tipu (Captain) - 25 kills', then Ghost, then Soap.
    //  soldier.name reads the name from the current card."
  }

  const sniper = squad.find(s => s.role === 'Sniper');
  // "Search the squad list. For each soldier (called 's'), check if s.role is 'Sniper'.
  //  Return the FIRST one that matches. Store it in 'sniper'.
  //  s => s.role === 'Sniper' is a mini function that checks one soldier."

  console.log('Sniper found:', sniper?.name);
  // "Print the name of whoever we found.
  //  The ? means 'if sniper exists, read .name. If nobody was found, don't crash.'
  //  Without the ?, if .find() found nothing, this line would crash."

  const elites = squad.filter(s => s.kills >= 30);
  // "Go through every soldier. Keep only the ones with 30 or more kills.
  //  .filter() gives back a NEW list with just those soldiers.
  //  Ghost (40 kills) and Soap (35 kills) pass. Tipu (25) doesn't."

  console.log('Elite soldiers:', elites.length);
  // "Print how many elite soldiers we found. Answer: 2."

  expect(squad.length).toBe(3);
  // "I expect 3 total soldiers."

  expect(sniper?.name).toBe('Ghost');
  // "I expect the sniper's name to be Ghost."

  expect(elites.length).toBe(2);
  // "I expect 2 elite soldiers (the ones with 30+ kills)."
});

test('real Playwright use - arrays and loops with elements', async ({ page }) => {
  // "Start a test that shows how arrays/loops work with real web pages."

  await page.goto('https://example.com');
  // "Open example.com in the browser. Wait until it loads."

  const title: string = await page.title();
  // "Ask the page 'what is your title?' Wait for the answer. Store it as text."

  console.log('Mission location:', title);
  // "Print the page title."

  const links = page.locator('a');
  // "Find ALL link elements (<a> tags) on the page. Store them in 'links'.
  //  This doesn't give you the actual text yet — just points at them."

  const linkCount: number = await links.count();
  // "Ask 'how many links did you find?' Wait for the answer. Store it as a number."

  console.log('Links found on page:', linkCount);
  // "Print how many links were found."

  for (let i = 0; i < linkCount; i++) {
    // "Loop from 0 to linkCount. So if there are 3 links, loop for i=0, i=1, i=2."

    const text = await links.nth(i).textContent();
    // "Get the link at position i. Read the text inside it. Wait for the answer.
    //  .nth(0) = first link, .nth(1) = second link, etc.
    //  .textContent() = 'what words are written on this link?'"

    console.log(`Link ${i}:`, text);
    // "Print which link number and what text it shows."
  }

  expect(title).toBe('Example Domain');
  // "I expect the page title to be 'Example Domain'."
});