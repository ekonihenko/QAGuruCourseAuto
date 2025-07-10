exports.HomePage = class HomePage {
  constructor(page) {
    this.page = page;
    this.globalFeedButton = page.getByRole('button', { name: 'Global Feed' });
    this.homeLink = page.getByRole('link', { name: ' Home' });
    this.articleLinks = page.locator('h1').filter({ hasText: /.+/ });
    this.articleTitleLink = (title) => page.getByRole('link', { name: title });
  }

  async gotoHomePage() {
    await this.homeLink.click();
  }

  async selectGlobalFeed() {
    await this.globalFeedButton.click();
  }

  async openArticleByTitle(title) {
    await this.articleTitleLink(title).click();
    return title;
  }

  async openFirstArticle() {
    const articles = await this.articleLinks;
    const firstArticleTitle = await articles.first().textContent();
    await articles.first().click();
    return firstArticleTitle;
  }
};
