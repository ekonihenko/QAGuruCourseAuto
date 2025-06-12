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

//Вариант1;//
test('Успешная авторизация пользователя ', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/');
  await page.getByRole('link', { name: ' Login' }).click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('katrinka28i@mail.ru');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');
  await page.getByRole('button', { name: 'Login' }).click();
});

//Вариант2.Что добавила:
// Проверка что после авторизации пользователь попал на главную страницу с лентой статей.
// Удалены лишние клики по полям.
// Добавлено больше пояснений к каждому шагу.//

test('Успешная авторизация пользователя', async ({ page }) => {
  // Переход на главную страницу
  await page.goto('https://realworld.qa.guru/');

  // Переход на страницу авторизации
  await page.getByRole('link', { name: ' Login' }).click();

  // Ввод email
  await page.getByRole('textbox', { name: 'Email' }).fill('katrinka28i@mail.ru');

  // Ввод пароля
  await page.getByRole('textbox', { name: 'Password' }).fill('123456');

  // Нажатие на кнопку "Login"
  await page.getByRole('button', { name: 'Login' }).click();

  // Проверка успешной авторизации
  await page.waitForSelector('text=Your Feed'); // Пример проверки
});
