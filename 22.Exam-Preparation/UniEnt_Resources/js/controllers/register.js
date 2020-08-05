import { register as apiRegister } from '../data.js';
import { showInfo, showError } from '../notification.js';
import { login } from '../data.js';

export default async function register() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    registerForm: await this.load('./templates/user/registerForm.hbs'),
  };
  this.partial('./templates/user/register.hbs', this.app.userData);
}

export async function registerPost() {
  try {
    if (this.params.password !== this.params.rePassword) {
      throw new Error("Passwords don't match!");
    }
    if (this.params.username.length < 3) {
      throw new Error('Username mast be at least 3 characters long!');
    }
    if (this.params.password.length < 6) {
      throw new Error('Password mast be at leadt 6 characters long!');
    }

    const result = await apiRegister(
      this.params.username,
      this.params.password
    );

    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    showInfo('User registration successful.');
  } catch (err) {
    showError(err.message);
  }

  try {
    const result = await login(this.params.username, this.params.password);
    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }
    this.app.userData.username = result.username;
    this.app.userData.userId = result.objectId;
    this.redirect('/');
  } catch (err) {
    showError(err.message);
  }
}
