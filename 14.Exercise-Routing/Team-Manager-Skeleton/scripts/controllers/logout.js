import { logout } from '../data.js';

export default async function () {
  this.partials = {
    header: await this.load('/templates/common/header.hbs'),
    footer: await this.load('/templates/common/footer.hbs'),
    loginForm: await this.load('/templates/login/loginForm.hbs'),
  };

  this.partial('/templates/home/home.hbs', this.app.userData);
  const result = await logout();
  if (result.status !== 200) {
    throw new Error('Unsuccessful logout!');
  }

  this.app.userData.loggedIn = false;
  this.app.userData.hasTeam = false;
  this.app.userData.teamId = undefined;
  this.app.userData.username = undefined;
  this.app.userData.userId = undefined;
  localStorage.removeItem('userToken');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');

  this.redirect('#/');
}
