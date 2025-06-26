import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CreateArticle } from '../pages/createArticle';

test('Create article test', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const Login = new LoginPage(page);
  const Article = new CreateArticle(page);

  // Сначала логинимся, потом создаем статью
  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  // Создаем статью
  await Article.createArticle('HW5', 'POM style', 'Create the article in the POM style', 'POM');
});
