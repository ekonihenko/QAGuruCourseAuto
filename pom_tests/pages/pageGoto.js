exports.Goto = class Goto {
  constructor(page) {
    this.page = page;
    this.homeLink = page.getByRole('link', { name: ' Home' });
  }

  async pageGoto() {
    await this.page.goto('https://realworld.qa.guru/#/');
  }

  async goToHomePage() {
    await this.homeLink.click();
  }
};
