import { logout as apiLogout } from '../dataOld.js';
import { showInfo, showError } from '../notification.js';

export default async function logout() {
  try {
    const result = await apiLogout();
    if (result.hasOwnProperty('errorData')) {
      // throw new Error(result.message);
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    this.app.userData.username = '';
    this.app.userData.userId = '';

    showInfo('Successfully loged out');

    this.redirect('#/');
  } catch (err) {
    showError(err.message);
  }
}
