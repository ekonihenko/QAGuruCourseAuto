export class LogoutPage {
  constructor(page) {
    this.page = page;
    this.userPick = page.getByText('Kate');
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
    this.loginButton = page.getByRole('link', { name: ' Login' }); // Добавляем локатор кнопки Login
  }

  async logout() {
    await this.userPick.waitFor({ state: 'visible' });
    await this.userPick.click();

    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click();
  }

  // Метод для получения локатора кнопки Login
  async getLoginButton() {
    return this.loginButton;
  }
}
