import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { CreateArticle } from '../pages/createArticle';
import { DeleteArticle } from '../pages/delArticle';

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

  // Убеждаюсь,что название удаленной статьи не отображается
  await expect(page.getByText(uniqueTitle)).not.toBeVisible();
});
