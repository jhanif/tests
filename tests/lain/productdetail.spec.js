// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/STORE/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  // Expects page to have a heading with the name of Samsung galaxy s6.
  await expect(page.getByRole('heading', { name: 'Samsung galaxy s6' })).toBeVisible();
});

test('get started link 2', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

  // Expects page to have a link with the name of Add to cart.
  await expect(page.getByRole('link', { name: 'Add to cart' })).toBeVisible();
});