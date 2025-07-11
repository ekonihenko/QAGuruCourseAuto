import { test, expect } from '@playwright/test';

test('Проверка отображения элементов навигации.Хедер', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');
  await expect(page.getByRole('banner').getByRole('link', { name: 'conduit' })).toBeVisible();
  await expect(page.getByRole('banner').getByRole('link', { name: ' Source code' })).toBeVisible();
  await expect(page.getByRole('link', { name: ' Home' })).toBeVisible();
  await expect(page.getByRole('link', { name: ' Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
});

test('Проверка названий элементов навигации.Хедер', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');
  await expect(page.locator('nav')).toContainText('Source code');
  await expect(page.locator('nav')).toContainText('Home');
  await expect(page.locator('nav')).toContainText('Login');
  await expect(page.locator('nav')).toContainText('Sign up');
  await expect(page.locator('nav')).toContainText('conduit');
});

test('Успешная авторизация пользователя', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');
  await page.getByRole('link', { name: ' Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('katrinka28i@mail.ru');
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Kate')).toBeVisible();
});
