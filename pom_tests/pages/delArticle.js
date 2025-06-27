exports.DeleteArticle = class DeleteArticle {
  constructor(page) {
    this.page = page;
    this.DeleteButton = page.getByRole('button', { name: ' Delete Article' }).first();
  }

  async delete() {
    await this.DeleteButton.click();
  }
};
