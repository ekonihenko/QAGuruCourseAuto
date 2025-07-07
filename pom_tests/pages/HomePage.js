exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.globalFeedButton = page.getByRole('button', { name: 'Global Feed' });
    this.homeLink = page.getByRole('link', { name: ' Home' });
    this.articleLinks = page.locator('h1').filter({ hasText: /.+/ });
  }

  async gotoHomePage() {
    await this.homeLink.click();
  }

  async selectGlobalFeed() {
    await this.globalFeedButton.click();
  }

  async openArticleByTitle(title) {
    await this.page.getByRole('link', { name: title }).click();
    return title;
  }

  async openFirstArticle() {
    //Получаю список статей
    const articles = await this.articleLinks;

    // Получаю текст первого заголовка
    const firstArticleTitle = await articles.first().textContent();

    // Кликаю на первую статью
    await articles.first().click();
    return firstArticleTitle;
  }
};
