exports.UpdateArticle = class UpdateArticle {
  constructor(page) {
    this.page = page;
    this.editLink = page.getByRole('link', { name: ' Edit Article' }).nth(1);
    this.articleBodyInput = page.getByRole('textbox', {
      name: 'Write your article (in markdown)',
    });
    this.updateButton = page.getByRole('button', { name: 'Update Article' });
  }

  async update(newContent) {
    await this.editLink.click();
    await this.articleBodyInput.clear();
    await this.articleBodyInput.fill(newContent);
    await this.updateButton.click();
  }

  async verifyUpdatedContentVisible(content) {
    await expect(this.page.getByText(content)).toBeVisible();
  }

  async verifyUpdatedContentVisible(content) {
    await expect(this.page.getByText(content)).toBeVisible();
  }
};
