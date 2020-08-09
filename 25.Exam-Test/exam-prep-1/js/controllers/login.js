import { login as apiLogin } from '../data.js';
import { showInfo, showError } from '../notification.js';

export default async function login() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    loginForm: await this.load('./templates/user/loginForm.hbs'),
  };
  this.partial('./templates/user/login.hbs', this.app.userData);
}

export async function loginPost() {
  try {
    if (this.params.username.length < 3) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials.'
      );
    }
    if (this.params.password.length < 6) {
      throw new Error(
        'Invalid credentials. Please retry your request with correct credentials.'
      );
    }

    const result = await apiLogin(this.params.username, this.params.password);
    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    this.app.userData.username = result.username;
    this.app.userData.userId = result.objectId;

    showInfo('Login successful.');
    this.redirect('/');
  } catch (err) {
    showError(err.message);
  }
}
