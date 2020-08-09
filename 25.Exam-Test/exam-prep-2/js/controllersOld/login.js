import { login as apiLogin } from '../dataOld.js';
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
      throw new Error('Username mast be at least 3 characters long!');
    }
    if (this.params.password.length < 6) {
      throw new Error('Password mast be at least 6 characters long!');
    }

    const result = await apiLogin(this.params.username, this.params.password);
    if (result.hasOwnProperty('errorData')) {
      // throw new Error(result.message);
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    this.app.userData.username = result.username;
    this.app.userData.userId = result.objectId;

    showInfo(`Logged in as ${result.username}`);
    this.redirect('#/');
  } catch (err) {
    showError(err.message);
  }
}
