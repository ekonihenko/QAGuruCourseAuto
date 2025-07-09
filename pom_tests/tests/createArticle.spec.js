import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CreateArticle } from '../pages/createArticle';
import { DeleteArticle } from '../pages/delArticle';
import { UpdateArticle } from '../pages/updateArticle';
import { HomePage } from '../pages/HomePage';
import { AddComment } from '../pages/addCom';
import { Goto } from '../pages/pageGoto';

test('Создание статьи', async ({ page }) => {
  const goto = new Goto(page);
  await goto.pageGoto();

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

  await expect(page.getByText(uniqueTitle)).toBeVisible();
});

test('Редактирование статьи', async ({ page }) => {
  const goto = new Goto(page);
  await goto.pageGoto();

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

  await expect(page.getByText(uniqueTitle)).toBeVisible();

  // Редактирование статьи
  const updatedContent = 'I am editing an article as part of testing.';
  await Update.update(updatedContent);

  await expect(page.getByText(updatedContent)).toBeVisible();
});

test('Удаление статьи', async ({ page }) => {
  const goto = new Goto(page);
  await goto.pageGoto();

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

  // Проверка видимости статьи перед удалением
  await expect(DelArt.articleTitle(uniqueTitle)).toBeVisible();

  // Удаление статьи
  await DelArt.delete();

  // Переход на главную страницу
  await goto.pageGoto();
  await page.getByRole('link', { name: ' Home' }).click();

  // Проверка отсутствия статьи после удаления
  await expect(DelArt.articleTitle(uniqueTitle)).not.toBeVisible();
});

test('Добавление комментария к статье', async ({ page }) => {
  const goto = new Goto(page);
  await goto.pageGoto();

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const addComment = new AddComment(page);

  // Логин
  await loginPage.gotoLoginPage();
  await loginPage.login('katrinka28i@mail.ru', '123456');

  // Открытие статьи
  await homePage.selectGlobalFeed();
  await homePage.openFirstArticle();

  // Добавление комментария
  const commentText = 'test';
  await addComment.addComment(commentText);

  // Проверка
  const firstComment = await addComment.getFirstComment();
  await expect(firstComment).toHaveText(commentText);
});
