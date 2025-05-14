import { test, expect } from '@playwright/test';

test('Проверка отображения элемента для перехода на страницу регистрации', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/');
  await expect(page.getByRole('link', { name: 'Sign up' })).toBeVisible();
});

test('Проверка названия элемента для перехода на страницу регистрации', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/');
  await expect(page.getByRole('link', { name: 'Sign up' })).toHaveText('Sign up');
});

test('Проверка названия элемента для перехода на страницу регистрации с локатором который предложен автоматически ', async ({
  page,
}) => {
  await page.goto('https://realworld.qa.guru/');
  await expect(page.locator('nav')).toContainText('Sign up');
});

test('Переход на страницу регистрации пользователя ', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/');
  await page.getByRole('link', { name: 'Sign up' }).click();
});

test('Успешная регистрация пользователя ', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Your Name' }).click();
  await page.getByRole('textbox', { name: 'Your Name' }).fill('Kate');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('katrinka28i@mail.ru');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Sign up' }).click();
});

test('Успешная авторизация пользователя ', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/');
  await page.getByRole('link', { name: ' Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('katrinka28i@mail.ru');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
});
