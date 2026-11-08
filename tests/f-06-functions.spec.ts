import { test, expect } from '@playwright/test';

// === REGULAR FUNCTION — like a mission with a fixed strategy ===
function calculateDamage(baseDamage: number, multiplier: number): number {
  return baseDamage * multiplier;
}

// === ARROW FUNCTION — same thing, shorter syntax ===
const calculateHealing = (health: number, potion: number): number => {
  return health + potion;
};

// === ARROW FUNCTION (one-liner) — even shorter ===
const isAlive = (health: number): boolean => health > 0;

test('regular function - calculate weapon damage', async ({ page }) => {
  const damage: number = calculateDamage(50, 2);
  console.log('Damage dealt:', damage); // 100

  expect(damage).toBe(100);
});

test('arrow function - healing potion', async ({ page }) => {
  const newHealth: number = calculateHealing(30, 50);
  console.log('Health after potion:', newHealth); // 80

  expect(newHealth).toBe(80);
});

test('arrow function one-liner - survival check', async ({ page }) => {
  console.log('Health 50 - alive?', isAlive(50));   // true
  console.log('Health 0 - alive?', isAlive(0));      // false

  expect(isAlive(50)).toBe(true);
  expect(isAlive(0)).toBe(false);
});

test('async function with Playwright - real mission', async ({ page }) => {
  // async/await = waiting for intel to come back from a recon mission
  await page.goto('https://example.com');
  const title: string = await page.title();
  console.log('Intel received:', title);

  // This is why Playwright uses async/await everywhere
  // page.goto() takes time (like sending a scout) — you WAIT for the result
  expect(title).toBe('Example Domain');
});