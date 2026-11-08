# F-06: Functions & Arrow Functions

## The Big Picture — What Is a Function?

In a CoD campaign, your safe house has **supply crates**. Each crate does ONE job:

- You give it something (input)
- It does its thing (process)
- It gives you something back (output)

A function is that crate. You build it once, use it as many times as you want.

---

## Regular Function — The Full Crate Label

```typescript
function refillAmmo(currentAmmo: number, extraMags: number): number {
  return currentAmmo + (extraMags * 30);
}
```

Breaking it down:

| Part | What It Is | CoD Analogy |
|------|-----------|-------------|
| `function` | Keyword that says "I'm building a crate" | Placing the crate in your safe house |
| `refillAmmo` | The crate's name/label | What's written on the crate |
| `(currentAmmo, extraMags)` | Inputs — what you feed in | What you hand to the crate |
| `: number` after `()` | What type of thing comes back | The crate always gives back a number |
| `return` | What the crate spits out | The refilled ammo count |

Using it:

```typescript
refillAmmo(10, 2);  // 10 + (2 * 30) = 70 rounds
refillAmmo(0, 5);   // 0 + (5 * 30) = 150 rounds
```

Same crate, different inputs, different outputs. Build once, use forever.

---

## Arrow Function — Shorter Label, Same Crate

```typescript
const craftExplosive = (gunpowder: number, casing: number): number => {
  return gunpowder + casing;
};
```

This does the EXACT same thing as a regular function. It's just written shorter. Think of it like your mission log — sometimes you write "Reconnaissance Mission" and sometimes you just write "Recon." Same mission.

### Regular vs Arrow — Side by Side

```typescript
// Regular — full label
function heal(health: number, medkit: number): number {
  return health + medkit;
}

// Arrow — short label, same crate
const heal = (health: number, medkit: number): number => {
  return health + medkit;
};
```

---

## One-Liner Arrow — The Quickest Label

When the crate does just ONE thing, you can make it even shorter — skip the `{}` and the `return`:

```typescript
const isAlive = (health: number): boolean => health > 0;
const isDead = (health: number): boolean => health <= 0;
const doubleXP = (xp: number): number => xp * 2;
```

It's like a quick radio call: "Status?" → "Alive." No extra words.

---

## Functions With No Return — Void

Some crates don't give anything back. They just DO something. Like a detonator — you press it, the building blows up, nothing comes back to your hand.

```typescript
function showMissionBriefing(missionName: string): void {
  console.log('=== MISSION BRIEFING ===');
  console.log('Mission:', missionName);
  console.log('========================');
}

showMissionBriefing('Operation Clean Sweep');
```

`: void` means "this crate gives nothing back — it just does its job."

---

## Functions With Multiple Parameters

Some crates need more inputs — like crafting a custom weapon needs the base gun, scope, and grip:

```typescript
function buildWeapon(gun: string, scope: string, grip: string): string {
  return gun + ' with ' + scope + ' and ' + grip;
}

buildWeapon('AK-47', 'Red Dot', 'Foregrip');
// "AK-47 with Red Dot and Foregrip"
```

---

## async/await — Crates That Take Time

In campaign, some things don't happen instantly:

- Calling an airstrike — you radio in, then WAIT for the jets
- Opening a heavy vault door — you turn the handle, then WAIT for it to open
- Hacking a terminal — you start the hack, then WAIT for the progress bar

In code, loading a web page is like that. It takes time. You can't check the page title while the page is still loading — just like you can't run into the strike zone while bombs are falling.

```typescript
// WITHOUT await — you run into the bombs 💀
page.goto('https://example.com');
const title = page.title(); // ERROR — page hasn't loaded yet!

// WITH await — you wait for the bombs to land, then move ✅
await page.goto('https://example.com');       // wait for page to load
const title = await page.title();              // wait for title to appear
```

Rules:
- `await` = "hold position until this finishes"
- `async` = marks the function as one that USES await inside it
- Every Playwright action uses `await` because browser stuff takes time

```typescript
test('mission with waiting', async ({ page }) => {
  await page.goto('https://example.com');     // send the scout, wait
  await page.click('a');                       // click a link, wait
  const text = await page.textContent('h1');   // read text, wait
  console.log(text);                           // instant — no wait needed
});
```

`console.log` doesn't need `await` because it's instant — like checking your own ammo count. No waiting, it's right there on your screen.

---

## Quick Reference

| Concept | Syntax | Analogy |
|---------|--------|---------|
| Regular function | `function name() {}` | Full crate label |
| Arrow function | `const name = () => {}` | Short crate label |
| One-liner arrow | `const name = () => result` | Quick radio call |
| Parameters | `(input1, input2)` | What you feed the crate |
| Return type | `(): number =>` | What type of thing comes back |
| `void` | `(): void =>` | Crate does its job, gives nothing back |
| `async` | `async ({ page }) =>` | "This mission involves waiting" |
| `await` | `await page.goto()` | "Hold position until this finishes" |

---

## Remember

- A function is a **reusable crate** — build once, use anytime
- `function` and `() =>` are two ways to write the same crate
- Always label your inputs (`: string`, `: number`) and output (`: boolean`)
- Playwright = lots of `await` because the browser is slow (like waiting for intel from the field)