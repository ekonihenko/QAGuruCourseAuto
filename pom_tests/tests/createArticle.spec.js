import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CreateArticle } from '../pages/createArticle';
import { DeleteArticle } from '../pages/delArticle';
import { UpdateArticle } from '../pages/updateArticle';
import { HomePage } from '../pages/HomePage';
import { AddComment } from '../pages/addCom';

test('Create article test', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const Login = new LoginPage(page);
  const Article = new CreateArticle(page);

  // Сначала логинимся, потом создаем статью
  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  const uniqueTitle = `HW5_${Date.now()}`;

  // Создаем статью
  await Article.createArticle(
    uniqueTitle,
    'POM style',
    'Create the article in the POM style',
    'POM',
  );
});

test('Редактирование статьи', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const Login = new LoginPage(page);
  const Article = new CreateArticle(page);
  const DelArt = new DeleteArticle(page);
  const uniqueTitle = `HW5_${Date.now()}`;
  const Update = new UpdateArticle(page);

  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  await Article.createArticle(
    uniqueTitle,
    'POM style',
    'Create the article in the POM style',
    'POM',
  );

  // Редактирование статьи
  const updatedContent = 'I am editing an article as part of testing.';
  await Update.update(updatedContent);
});

test('Удаление статьи', async ({ page }) => {
  await page.goto('https://realworld.qa.guru/#/');

  const Login = new LoginPage(page);
  const Article = new CreateArticle(page);
  const DelArt = new DeleteArticle(page);
  const uniqueTitle = `HW5_${Date.now()}`;

  await Login.gotoLoginPage();
  await Login.login('katrinka28i@mail.ru', '123456');

  await Article.createArticle(
    uniqueTitle,
    'POM style',
    'Create the article in the POM style',
    'POM',
  );

  await expect(page.getByText(uniqueTitle)).toBeVisible();

  await DelArt.delete(uniqueTitle);

  await page.goto('https://realworld.qa.guru/#/');
  await page.getByRole('link', { name: ' Home' }).click();
});

test('Добавление комментария к статье', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const addComment = new AddComment(page);

  await loginPage.gotoLoginPage();
  await loginPage.login('katrinka28i@mail.ru', '123456');

  // Открываю Home и выбираю вкладку Global Feed
  await homePage.selectGlobalFeed();

  const selectedArticleTitle = await homePage.openFirstArticle();

  // Добавление комментария
  const commentText = 'test';
  await addComment.addComment(commentText);

  // Проверка видимости комментария
  await addComment.verifyCommentVisible(commentText);
});
