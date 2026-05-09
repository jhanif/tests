// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Demoblaze Test Suite', () => {

  const password = 'password123';
  let username;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');
  });

  test('E2E: User bisa Sign Up -> Login -> Purchase', async ({ page }) => {

    username = `user_${Date.now()}`;

    // ---- SIGN UP ----
    await page.getByRole('link', { name: 'Sign up' }).click();

    // Assertion modal SIGN UP visible
    await expect(
      page.getByRole('heading', { name: 'Sign up' })
    ).toBeVisible();

    await page.locator('#sign-username').fill(username);
    await page.locator('#sign-password').fill(password);

    // Assertion popup signup success
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Sign up successful.');
      await dialog.accept();
    });

    await page.getByRole('button', { name: 'Sign up' }).click();

    // Wait modal closed
    await page.waitForSelector('.modal', { state: 'hidden' });

    // ---- LOGIN ----
    await page.getByRole('link', { name: 'Log in' }).click();

    // Assertion modal LOGIN visible
    await expect(
      page.getByRole('heading', { name: 'Log in' })
    ).toBeVisible();

    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);

    await page.getByRole('button', { name: 'Log in' }).click();

    // Assertion login success
    await expect(
      page.locator('#nameofuser')
    ).toHaveText(`Welcome ${username}`);

  });

  // =========================
  // TEST CASE BARU
  // =========================

  test('User able to click product and add to cart', async ({ page }) => {

    // Assertion homepage loaded
    await expect(page).toHaveURL('https://www.demoblaze.com/');

    // Click product
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

    // Assertion product detail page displayed
    await expect(
      page.getByRole('heading', { name: 'Samsung galaxy s6' })
    ).toBeVisible();

    // Assertion Add to cart button visible
    await expect(
      page.getByRole('link', { name: 'Add to cart' })
    ).toBeVisible();

    // Wait popup alert
    const dialogPromise = page.waitForEvent('dialog');

    // Click Add to cart
    await page.getByRole('link', { name: 'Add to cart' }).click();

    // Assertion popup message
    const dialog = await dialogPromise;

    expect(dialog.message()).toBe('Product added.');

    // Click OK popup
    await dialog.accept();

  });

});