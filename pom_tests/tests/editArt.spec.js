import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CreateArticle } from '../pages/createArticle';
import { DeleteArticle } from '../pages/delArticle';
import { UpdateArticle } from '../pages/updateArticle';

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

  //Статью видно после создания
  await expect(page.getByText(uniqueTitle)).toBeVisible();

  // Редактирование статьи
  const updatedContent = 'I am editing an article as part of testing.';
  await Update.update(updatedContent);

  //Убедиться, что в статье отображаются изменения
  await expect(page.getByText(updatedContent)).toBeVisible();
});
