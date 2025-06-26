exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    this.Email_textbox = page.getByRole('textbox', { name: 'Email' });
    this.Password_textbox = page.getByRole('textbox', { name: 'Password' });
    this.Login_button = page.getByRole('button', { name: 'Login' });
  }

  async gotoLoginPage() {
    await this.page.goto('https://realworld.qa.guru/#/login');
  }

  async login(Email, Password) {
    await this.Email_textbox.fill(Email);
    await this.Password_textbox.fill(Password);
    await this.Login_button.click();
  }
};
