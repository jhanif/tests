const { test, expect } = require('@playwright/test');

test('Successful login on SauceDemo', async ({ page }) => {
  // 1. Open login page
  await page.goto('https://www.saucedemo.com/');

  // 2. Fill in username
  await page.getByPlaceholder('Username').fill('standard_user');

  // 3. Fill in password
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // 4. Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  // 5. Expect to be redirected to inventory page
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // 6. Validate page content
  await expect(page.locator('.title')).toHaveText('Products');
});