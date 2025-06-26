import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';

test('test', async ({ page }) => {
  const Login = new LoginPage(page);

  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  //   await page.goto('https://realworld.qa.guru/#/login');
  //   await page.getByRole('textbox', { name: 'Email' }).click();
  //   await page.getByRole('textbox', { name: 'Email' }).fill('katrinka28i@mail.ru');
  //   await page.getByRole('textbox', { name: 'Password' }).click();
  //   await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  //   await page.getByRole('button', { name: 'Login' }).click();
});
