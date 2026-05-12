// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Demoblaze Test Suite', () => {

  const password = 'password123';
  let username;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.demoblaze.com/');
    // Assert URL dipindah ke sini biar rapi dan nggak diulang di tiap test
    await expect(page).toHaveURL('https://www.demoblaze.com/');
  });

  test('E2E: User bisa Sign Up -> Login -> Purchase', async ({ page }) => {

    // Tambahin randomizer biar username 100% unik
    username = `user_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // =========================
    // SIGN UP
    // =========================

    await page.getByRole('link', { name: 'Sign up' }).click();

    // Limit scope pencarian khusus di dalem modal Sign up aja
    const signUpModal = page.getByRole('dialog', { name: 'Sign up' });

    // Pastikan modal Sign up udah muncul
    await expect(
      signUpModal.getByRole('heading', { name: 'Sign up' })
    ).toBeVisible();

    // Fill form (di sini getByLabel aman karena HTML-nya bener)
    await signUpModal.getByLabel('Username').fill(username);
    await signUpModal.getByLabel('Password').fill(password);

    // Handle alert bawaan browser menggunakan Promise.all (best practice Playwright)
    const [signupDialog] = await Promise.all([
      page.waitForEvent('dialog'),
      signUpModal.getByRole('button', { name: 'Sign up' }).click()
    ]);

    // Assert isi alert message
    expect(signupDialog.message()).toContain('Sign up successful');

    // Klik OK di alert
    await signupDialog.accept();

    // Pastikan modal Sign up beneran ketutup
    await expect(signUpModal).toBeHidden();

    // =========================
    // LOGIN
    // =========================

    await page.getByRole('link', { name: 'Log in' }).click();

    // Limit scope pencarian di dalem modal Log in
    const loginModal = page.getByRole('dialog', { name: 'Log in' });

    // Pastikan modal Log in udah muncul
    await expect(
      loginModal.getByRole('heading', { name: 'Log in' })
    ).toBeVisible();

    // NOTE: Khusus form Login terpaksa fallback pakai ID.
    // Web Demoblaze ada bug: label for="log-name" tapi input id="loginusername".
    // Kalau dipaksain pakai getByLabel() bakal timeout karena browser ngebaca labelnya "Not specified".
    await loginModal.locator('#loginusername').fill(username);
    await loginModal.locator('#loginpassword').fill(password);

    await loginModal.getByRole('button', { name: 'Log in' }).click();

    // Pastikan modal Log in ketutup dulu (menandakan API request selesai)
    await expect(loginModal).toBeHidden();

    // Assert berhasil login pakai getByText dengan extra timeout 15 detik 
    // (Demoblaze kadang butuh waktu lebih dari 5 detik buat render UI)
    await expect(page.getByText(`Welcome ${username}`)).toBeVisible({ timeout: 15000 });

  });

  // =========================
  // ADD TO CART
  // =========================

  test('User able to click product and add to cart', async ({ page }) => {

    // Klik produk pertama
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();

    // Pastikan udah masuk ke halaman detail produk
    await expect(
      page.getByRole('heading', { name: 'Samsung galaxy s6' })
    ).toBeVisible();

    // Pastikan tombol Add to cart udah kerender
    await expect(
      page.getByRole('link', { name: 'Add to cart' })
    ).toBeVisible();

    // Handle alert menggunakan Promise.all (best practice Playwright)
    const [cartDialog] = await Promise.all([
      page.waitForEvent('dialog'),
      page.getByRole('link', { name: 'Add to cart' }).click()
    ]);

    // Assert alert message pas add to cart
    expect(cartDialog.message()).toContain('Product added');

    // Klik OK di alert
    await cartDialog.accept();

  });

});