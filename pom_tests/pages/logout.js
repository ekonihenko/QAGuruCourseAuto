export class LogoutPage {
  constructor(page) {
    this.page = page;
    this.userPick = page.getByText('Kate');
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
  }

  async logout() {
    //Жду пока элемент станет видимым на странице
    await this.userPick.waitFor({ state: 'visible' });
    await this.userPick.click();

    //Жду пока кнопка логаута станет видимой
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }
}
