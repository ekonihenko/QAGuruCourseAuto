exports.CreateArticle = class CreateArticle {
  constructor(page) {
    this.page = page;
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
    this.articleTitleTextbox = page.getByRole('textbox', { name: 'Article Title' });
    this.articleAboutTextbox = page.getByRole('textbox', { name: "What's this article about?" });
    this.articleBodyTextbox = page.getByRole('textbox', {
      name: 'Write your article (in markdown)',
    });
    this.articleTagsTextbox = page.getByRole('textbox', { name: 'Enter tags' });
    this.publishArticleButton = page.getByRole('button', { name: 'Publish Article' });
  }

  async gotoCreateArticle() {
    await this.newArticleLink.click();
  }

  async createArticle(articleTitle, articleAbout, articleBody, articleTags) {
    await this.gotoCreateArticle();
    await this.articleTitleTextbox.fill(articleTitle);
    await this.articleAboutTextbox.fill(articleAbout);
    await this.articleBodyTextbox.fill(articleBody);
    await this.articleTagsTextbox.fill(articleTags);
    await this.publishArticleButton.click();
  }
};
