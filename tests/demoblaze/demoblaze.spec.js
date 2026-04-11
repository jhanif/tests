// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Demoblaze Test Suite', () => {

  const password = 'password123';
  let username;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');
  });

  test('E2E: User bisa Sign Up -> Login -> Purchase', async ({ page }) => {

    username = `user_${Date.now()}`;  // unique

    // ---- SIGN UP ----
    await page.getByRole('link', { name: 'Sign up' }).click();

    // validasi modal khusus SIGN UP
    await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();

    await page.locator('#sign-username').fill(username);
    await page.locator('#sign-password').fill(password);

   // ASSERTION SIGN UP BERHASIL
    page.once('dialog', async dialog => {
     expect(dialog.message()).toBe('Sign up successful.');
    await dialog.accept();
    });

    await page.getByRole('button', { name: 'Sign up' }).click();

    // opsional: tunggu modal hilang
    await page.waitForSelector('.modal', { state: 'hidden' });


    // ---- LOGIN ----
    await page.getByRole('link', { name: 'Log in' }).click();

    // validasi modal khusus LOGIN
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible();

    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);

    await page.getByRole('button', { name: 'Log in' }).click();

    // validasi login sukses (muncul Welcome <username>)
    await expect(page.locator('#nameofuser')).toHaveText(`Welcome ${username}`);
  });

});