import { test, expect } from '@playwright/test';

test('learn TypeScript basics', async ({ page }) => {

  // Variables — storing weapons in your locker
  let playerName: string = 'Tipu';
  let kills: number = 25;
  let isAlive: boolean = true;
  let weapons: string[] = ['AK-47', 'M4A1', 'Sniper'];

  // Console.log — checking your inventory
  console.log('Player:', playerName);
  console.log('Kills:', kills);
  console.log('Alive?', isAlive);
  console.log('Weapons:', weapons);

  // let vs const
  let score: number = 100;      // let = can change later
  score = 200;                   // works fine

  const teamName: string = 'Alpha';  // const = locked forever
  // teamName = 'Beta';              // ERROR! const can't change

  // Navigate and use a variable
  await page.goto('https://example.com');
  const title: string = await page.title();
  console.log('Page title is:', title);
  await expect(page).toHaveTitle(title);
});