// ============================================================
// F-11: Actions & Interactions — Doing Things on the Battlefield
// ============================================================
// CoD Campaign Analogy:
// In F-09 and F-10, you learned how to FIND things (locators).
// That's like spotting an enemy, a door, or a switch.
// But spotting isn't enough — you need to ACT:
//   click()       = pull the trigger / press a button
//   fill()        = load ammo into a weapon / type into a box
//   check()       = flip a switch ON
//   uncheck()     = flip a switch OFF
//   selectOption() = choose a channel on your radio dial
//   hover()       = aim at something without firing
//   press()       = hit a key on your keyboard (Enter, Tab, etc.)
//   dblclick()    = double-tap (two quick shots)
//   focus()       = aim your sights at something
//   clear()       = empty the magazine / clear a text field
//
// Every action needs await because the browser takes time
// (like waiting for a door to open after you push it).
// ============================================================

// --- Load Playwright's test tools ---
import { test, expect } from '@playwright/test';

// ============================================================
// TEST 1: click() — Press Buttons and Links
// ============================================================
// CoD Analogy: Pulling the trigger, pressing a detonator,
// or hitting a switch on a wall. click() ACTIVATES things.
// ============================================================
test('click — pressing buttons and links', async ({ page }) => {

  // --- Build a page with clickable things ---
  await page.setContent(`
    <button id="detonate">Detonate C4</button>
    <a href="#vault" id="vault-link">Open Vault</a>
    <div id="status">Waiting...</div>
    <script>
      document.getElementById('detonate').addEventListener('click', () => {
        document.getElementById('status').textContent = 'BOOM! C4 Detonated!';
      });
      document.getElementById('vault-link').addEventListener('click', () => {
        document.getElementById('status').textContent = 'Vault is now open!';
      });
    </script>
  `);

  // --- Check the status starts as "Waiting..." ---
  await expect(page.locator('#status')).toHaveText('Waiting...');

  // --- Click the detonate button ---
  // click() = activate this element (press the button)
  // It's like pulling the trigger — one press, one action
  await page.locator('#detonate').click();

  // --- Check the status changed ---
  await expect(page.locator('#status')).toHaveText('BOOM! C4 Detonated!');

  // --- Now click the vault link ---
  await page.locator('#vault-link').click();

  // --- Check the status changed again ---
  await expect(page.locator('#status')).toHaveText('Vault is now open!');
});

// ============================================================
// TEST 2: fill() and clear() — Typing and Erasing Text
// ============================================================
// CoD Analogy: fill() is like loading a specific ammo type
// into your weapon. clear() is like emptying the magazine.
// fill() REPLACES whatever is in the box (doesn't add to it).
// ============================================================
test('fill and clear — typing into input fields', async ({ page }) => {

  // --- Build a page with input fields ---
  await page.setContent(`
    <label for="callsign">Callsign:</label>
    <input id="callsign" type="text" value="Unknown" />
    <label for="frequency">Radio Frequency:</label>
    <input id="frequency" type="text" />
  `);

  // --- The callsign field starts with "Unknown" ---
  await expect(page.locator('#callsign')).toHaveValue('Unknown');

  // --- fill() replaces the text completely ---
  // fill('TIPU') = clear whatever is there and type "TIPU"
  // It's like ejecting the current ammo and loading new ones
  await page.locator('#callsign').fill('TIPU');

  // --- Check the value changed ---
  await expect(page.locator('#callsign')).toHaveValue('TIPU');

  // --- Fill the frequency field ---
  await page.locator('#frequency').fill('Channel 7');
  await expect(page.locator('#frequency')).toHaveValue('Channel 7');

  // --- clear() empties the field completely ---
  // clear() = empty the magazine, nothing left
  await page.locator('#frequency').clear();

  // --- Check the field is now empty ---
  // '' means empty string — nothing in there
  await expect(page.locator('#frequency')).toHaveValue('');
});

// ============================================================
// TEST 3: type() — Typing One Key at a Time
// ============================================================
// CoD Analogy: fill() loads the whole magazine at once.
// type() is like loading bullets ONE BY ONE.
// Each letter is typed separately with a tiny delay.
// Useful when a website reacts to each keypress (like search).
// ============================================================
test('type — slow typing one character at a time', async ({ page }) => {

  // --- Build a page with a search box that reacts to typing ---
  await page.setContent(`
    <input id="search" type="text" placeholder="Search intel..." />
    <div id="suggestions"></div>
    <script>
      document.getElementById('search').addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length > 0) {
          document.getElementById('suggestions').textContent = 'Searching for: ' + val;
        } else {
          document.getElementById('suggestions').textContent = '';
        }
      });
    </script>
  `);

  // --- Use pressSequentially to type one key at a time ---
  // pressSequentially('AK-47') types A, then K, then -, then 4, then 7
  // Each key fires the 'input' event so the page reacts to each letter
  // It's like loading bullets one by one — the weapon adjusts after each
  await page.locator('#search').pressSequentially('AK-47', { delay: 100 });

  // --- Check the page reacted to our typing ---
  await expect(page.locator('#suggestions')).toHaveText('Searching for: AK-47');
});

// ============================================================
// TEST 4: check() and uncheck() — Checkboxes (Flip Switches)
// ============================================================
// CoD Analogy: Mission settings before you deploy:
//   ✅ Night vision — ON (checked)
//   ⬜ Silencer — OFF (unchecked)
// check() flips the switch ON.
// uncheck() flips the switch OFF.
// ============================================================
test('check and uncheck — toggling checkboxes', async ({ page }) => {

  // --- Build a page with checkboxes ---
  await page.setContent(`
    <label><input type="checkbox" id="night-vision" /> Night Vision</label>
    <label><input type="checkbox" id="silencer" checked /> Silencer</label>
    <label><input type="checkbox" id="thermal" /> Thermal Scope</label>
  `);

  // --- Night vision starts unchecked ---
  // toBeChecked() checks if the box is ticked
  // not in front means "should NOT be checked"
  await expect(page.locator('#night-vision')).not.toBeChecked();

  // --- Check (turn ON) night vision ---
  // check() = flip the switch to ON position
  await page.locator('#night-vision').check();

  // --- Now it should be checked ---
  await expect(page.locator('#night-vision')).toBeChecked();

  // --- Silencer starts already checked (it has "checked" in the HTML) ---
  await expect(page.locator('#silencer')).toBeChecked();

  // --- Uncheck (turn OFF) silencer ---
  // uncheck() = flip the switch to OFF position
  await page.locator('#silencer').uncheck();

  // --- Now silencer should NOT be checked ---
  await expect(page.locator('#silencer')).not.toBeChecked();

  // --- Check thermal scope too ---
  await page.locator('#thermal').check();
  await expect(page.locator('#thermal')).toBeChecked();
});

// ============================================================
// TEST 5: selectOption() — Dropdown Menus (Radio Dial)
// ============================================================
// CoD Analogy: Selecting a radio channel on your comms dial.
// You have a dropdown with options, and you pick ONE.
// selectOption() chooses an option from a <select> dropdown.
// ============================================================
test('selectOption — choosing from dropdown menus', async ({ page }) => {

  // --- Build a page with dropdown menus ---
  await page.setContent(`
    <label for="weapon">Primary Weapon:</label>
    <select id="weapon">
      <option value="">-- Choose Weapon --</option>
      <option value="ak47">AK-47</option>
      <option value="m4a1">M4A1</option>
      <option value="mp5">MP5</option>
    </select>

    <label for="region">Deployment Region:</label>
    <select id="region">
      <option value="">-- Select Region --</option>
      <option value="urban">Urban City</option>
      <option value="desert">Desert Plains</option>
      <option value="arctic">Arctic Base</option>
    </select>
  `);

  // --- Select a weapon by its VALUE ---
  // selectOption('ak47') = choose the option whose value is "ak47"
  // It's like turning your radio dial to channel "ak47"
  await page.locator('#weapon').selectOption('ak47');

  // --- Check the selected value ---
  await expect(page.locator('#weapon')).toHaveValue('ak47');

  // --- Select a region by its VISIBLE TEXT ---
  // { label: 'Desert Plains' } = choose the option that DISPLAYS "Desert Plains"
  // Sometimes you pick by what you SEE, not the hidden value
  await page.locator('#region').selectOption({ label: 'Desert Plains' });

  // --- Check the value (the hidden value, not the display text) ---
  await expect(page.locator('#region')).toHaveValue('desert');

  // --- Change weapon to MP5 ---
  await page.locator('#weapon').selectOption('mp5');
  await expect(page.locator('#weapon')).toHaveValue('mp5');
});

// ============================================================
// TEST 6: hover() — Aim Without Firing
// ============================================================
// CoD Analogy: Hovering your crosshair over something without
// pulling the trigger. Some things react when you just AIM
// at them — like a door that opens when you get close,
// or a tooltip that appears when you hover over an item.
// ============================================================
test('hover — aiming without clicking', async ({ page }) => {

  // --- Build a page where hovering reveals hidden content ---
  await page.setContent(`
    <div id="weapon-slot" style="padding: 20px; border: 1px solid black; cursor: pointer;">
      Hover to see weapon stats
    </div>
    <div id="stats" style="display: none;">
      Damage: 35 | Range: 50m | Fire Rate: 600rpm
    </div>
    <script>
      const slot = document.getElementById('weapon-slot');
      const stats = document.getElementById('stats');
      slot.addEventListener('mouseenter', () => { stats.style.display = 'block'; });
      slot.addEventListener('mouseleave', () => { stats.style.display = 'none'; });
    </script>
  `);

  // --- Stats are hidden at first ---
  await expect(page.locator('#stats')).toBeHidden();

  // --- Hover over the weapon slot ---
  // hover() = move your cursor over this element without clicking
  // It's like aiming your crosshair at something — things might react
  await page.locator('#weapon-slot').hover();

  // --- Now the stats should be visible ---
  await expect(page.locator('#stats')).toBeVisible();
  await expect(page.locator('#stats')).toContainText('Damage: 35');
});

// ============================================================
// TEST 7: press() — Hitting Keyboard Keys
// ============================================================
// CoD Analogy: Pressing buttons on your controller/keyboard.
// press('Enter') = confirm/submit
// press('Tab') = switch to next item
// press('Escape') = cancel/close menu
// press('Backspace') = delete last character
// ============================================================
test('press — hitting keyboard keys', async ({ page }) => {

  // --- Build a page with a form ---
  await page.setContent(`
    <input id="field1" type="text" placeholder="First field" />
    <input id="field2" type="text" placeholder="Second field" />
    <div id="result"></div>
    <script>
      document.getElementById('field1').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          document.getElementById('result').textContent = 'Mission confirmed!';
        }
      });
    </script>
  `);

  // --- Click on the first field to focus it ---
  await page.locator('#field1').click();

  // --- Type something ---
  await page.locator('#field1').fill('Operation Alpha');

  // --- Press Tab to move to the next field ---
  // press('Tab') = move focus to the next element
  // It's like switching from your primary weapon to your sidearm
  await page.locator('#field1').press('Tab');

  // --- Now field2 should be focused ---
  // We can check by typing in field2
  await page.locator('#field2').fill('Sector 7');
  await expect(page.locator('#field2')).toHaveValue('Sector 7');

  // --- Go back to field1 and press Enter ---
  await page.locator('#field1').press('Enter');

  // --- Check that Enter triggered the event ---
  await expect(page.locator('#result')).toHaveText('Mission confirmed!');
});

// ============================================================
// TEST 8: dblclick() — Double-Tap
// ============================================================
// CoD Analogy: Sometimes you need to DOUBLE-TAP — two quick
// shots. Some things on a webpage need a double-click
// to activate (like editing text or opening a file).
// ============================================================
test('dblclick — double-click to activate', async ({ page }) => {

  // --- Build a page where double-click edits text ---
  await page.setContent(`
    <div id="editable" style="padding: 10px; border: 1px solid grey;">
      Double-click to edit this intel
    </div>
    <input id="editor" type="text" style="display: none;" />
    <script>
      document.getElementById('editable').addEventListener('dblclick', () => {
        document.getElementById('editable').style.display = 'none';
        const editor = document.getElementById('editor');
        editor.style.display = 'block';
        editor.value = 'Double-click to edit this intel';
        editor.focus();
      });
    </script>
  `);

  // --- The text div is visible, editor is hidden ---
  await expect(page.locator('#editable')).toBeVisible();
  await expect(page.locator('#editor')).toBeHidden();

  // --- Double-click the text ---
  // dblclick() = two rapid clicks, like a double-tap
  await page.locator('#editable').dblclick();

  // --- Now the editor should appear ---
  await expect(page.locator('#editor')).toBeVisible();

  // --- The editor should have the text ---
  await expect(page.locator('#editor')).toHaveValue('Double-click to edit this intel');
});

// ============================================================
// TEST 9: focus() and blur — Aim and Un-aim
// ============================================================
// CoD Analogy: focus() = aiming down sights at a specific target.
// blur = lowering your weapon (removing focus).
// When an input gets focus, it often shows a border or glow.
// ============================================================
test('focus — aiming at a specific input', async ({ page }) => {

  // --- Build a page with focus effects ---
  await page.setContent(`
    <input id="target" type="text" placeholder="Focus on me!" />
    <div id="focus-status">Not focused</div>
    <script>
      const input = document.getElementById('target');
      input.addEventListener('focus', () => {
        document.getElementById('focus-status').textContent = 'Target acquired!';
      });
      input.addEventListener('blur', () => {
        document.getElementById('focus-status').textContent = 'Target lost...';
      });
    </script>
  `);

  // --- Status starts as "Not focused" ---
  await expect(page.locator('#focus-status')).toHaveText('Not focused');

  // --- Focus on the input ---
  // focus() = put your cursor/attention on this element
  // It's like aiming down sights — the element is now your target
  await page.locator('#target').focus();

  // --- Status should change to "Target acquired!" ---
  await expect(page.locator('#focus-status')).toHaveText('Target acquired!');

  // --- Click somewhere else to remove focus (blur) ---
  // Clicking on the body removes focus from the input
  await page.locator('body').click();

  // --- Status should change to "Target lost..." ---
  await expect(page.locator('#focus-status')).toHaveText('Target lost...');
});

// ============================================================
// TEST 10: Real Mission — Full Form Interaction
// ============================================================
// CoD Analogy: A full mission where you use EVERY weapon
// and skill you've learned. Fill forms, check boxes,
// select dropdowns, press keys — all in one go.
// ============================================================
test('real mission — full form interaction', async ({ page }) => {

  // --- Build a complete mission setup form ---
  await page.setContent(`
    <h1>Mission Setup</h1>
    <form id="mission-form">
      <label for="operator-name">Operator Name:</label>
      <input id="operator-name" type="text" placeholder="Your callsign" />

      <label for="mission-type">Mission Type:</label>
      <select id="mission-type">
        <option value="">-- Select --</option>
        <option value="recon">Reconnaissance</option>
        <option value="assault">Direct Assault</option>
        <option value="stealth">Stealth Infiltration</option>
      </select>

      <label><input type="checkbox" id="night-op" /> Night Operation</label>
      <label><input type="checkbox" id="solo-op" /> Solo Mission</label>

      <label for="notes">Mission Notes:</label>
      <textarea id="notes" placeholder="Additional intel..."></textarea>

      <button type="button" id="deploy-btn">Deploy</button>
      <div id="mission-result"></div>
    </form>
    <script>
      document.getElementById('deploy-btn').addEventListener('click', () => {
        const name = document.getElementById('operator-name').value;
        const type = document.getElementById('mission-type');
        const typeText = type.options[type.selectedIndex].text;
        const night = document.getElementById('night-op').checked;
        const solo = document.getElementById('solo-op').checked;
        const notes = document.getElementById('notes').value;

        let result = name + ' deployed on ' + typeText;
        if (night) result += ' (Night Op)';
        if (solo) result += ' (Solo)';
        if (notes) result += ' — Notes: ' + notes;

        document.getElementById('mission-result').textContent = result;
      });
    </script>
  `);

  // --- Step 1: Fill in operator name ---
  await page.getByLabel('Operator Name:').fill('TIPU');

  // --- Step 2: Select mission type from dropdown ---
  await page.locator('#mission-type').selectOption('stealth');

  // --- Step 3: Check "Night Operation" checkbox ---
  await page.locator('#night-op').check();

  // --- Step 4: Check "Solo Mission" checkbox ---
  await page.locator('#solo-op').check();

  // --- Step 5: Type mission notes ---
  await page.locator('#notes').fill('High value target in sector 9');

  // --- Step 6: Verify everything is set correctly ---
  await expect(page.getByLabel('Operator Name:')).toHaveValue('TIPU');
  await expect(page.locator('#mission-type')).toHaveValue('stealth');
  await expect(page.locator('#night-op')).toBeChecked();
  await expect(page.locator('#solo-op')).toBeChecked();
  await expect(page.locator('#notes')).toHaveValue('High value target in sector 9');

  // --- Step 7: Click Deploy ---
  await page.locator('#deploy-btn').click();

  // --- Step 8: Check the result message ---
  const result = page.locator('#mission-result');
  await expect(result).toContainText('TIPU');
  await expect(result).toContainText('Stealth Infiltration');
  await expect(result).toContainText('Night Op');
  await expect(result).toContainText('Solo');
  await expect(result).toContainText('High value target in sector 9');

  // --- Log the full result ---
  const resultText = await result.textContent();
  console.log('Mission deployed:', resultText);
});