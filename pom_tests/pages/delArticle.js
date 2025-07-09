exports.DeleteArticle = class DeleteArticle {
  constructor(page) {
    this.page = page;
    this.deleteButton = page.getByRole('button', { name: ' Delete Article' }).first();
  }

  async delete() {
    await this.deleteButton.click();
  }

  articleTitle(title) {
    return this.page.getByText(title);
  }
};
