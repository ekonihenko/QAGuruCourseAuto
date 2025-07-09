exports.DeleteArticle = class DeleteArticle {
  constructor(page) {
    this.page = page;
    this.DeleteButton = page.getByRole('button', { name: ' Delete Article' }).first();
    this.articleTitleLocator = (title) => page.getByText(title);
  }

  async delete() {
    await this.DeleteButton.click();
  }

  async getArticleTitleLocator(title) {
    return this.articleTitleLocator(title);
  }
};
