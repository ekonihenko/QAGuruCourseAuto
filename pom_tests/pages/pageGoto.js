export class Goto {
  constructor(page) {
    this.page = page;
  }

  // Добавила метод открытия главной страницы
  async pageGoto() {
    await this.page.goto('https://realworld.qa.guru/#/');
  }
}
