import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CreateArticle } from '../pages/createArticle';
import { AddComment } from '../pages/addCom';

test('Add Comment', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const Login = new LoginPage(page);
  const Article = new CreateArticle(page);
  const AddCom = new AddComment(page);

  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  // Создаем статью
  await Article.createArticle('HW5', 'POM style', 'Create the article in the POM style', 'POM');

  // Переходим на страницу статьи
  await AddCom.gotoAddComment('HW5');

  // Добавляем комментарий
  await AddCom.addComment('Good information!');
});
