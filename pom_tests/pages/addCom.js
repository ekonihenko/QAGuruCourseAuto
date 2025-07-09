exports.AddComment = class AddComment {
  constructor(page) {
    this.page = page;
    this.WriteComment_textbox = page.getByRole('textbox', {
      name: 'Write a comment...',
    });
    this.PostComment_button = page.getByRole('button', {
      name: 'Post Comment',
    });
    this.commentContent = page.locator('div.card-text');
    this.commentText = page.locator('.card-text').first();
  }

  async gotoAddComment(articleSlug) {
    await this.page.goto(`https://realworld.qa.guru/#/article/${articleSlug}`);
  }

  async addComment(writeComment) {
    await this.WriteComment_textbox.fill(writeComment);
    await this.PostComment_button.click();
  }
};
