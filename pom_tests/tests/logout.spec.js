import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { LogoutPage } from '../pages/logout';

test('Logout', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const loginPage = new LoginPage(page);
  const logoutPage = new LogoutPage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login('katrinka28i@mail.ru', '123456');

  await expect(page.getByRole('link', { name: ' Login' })).toBeVisible();
  // Проверяем успешный вход
  await expect(page.getByText('Kate')).toBeVisible();

  // Разлогиниваемся
  await logoutPage.logout();

  // Проверяем, что разлогинились
  await expect(page.getByRole('link', { name: ' Login' })).toBeVisible();
});
