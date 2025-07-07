import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { LogoutPage } from '../pages/logout';

test('Авторизация', async ({ page }) => {
  const Login = new LoginPage(page);

  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  await expect(page.getByText('Kate')).toBeVisible();
});

test('Logout', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const loginPage = new LoginPage(page);
  const logoutPage = new LogoutPage(page);

  await loginPage.gotoLoginPage();
  await loginPage.login('katrinka28i@mail.ru', '123456');

  // Разлогиниваемся
  await logoutPage.logout();

  // Проверяем, что разлогинились
  await expect(page.getByRole('link', { name: ' Login' })).toBeVisible();
});
