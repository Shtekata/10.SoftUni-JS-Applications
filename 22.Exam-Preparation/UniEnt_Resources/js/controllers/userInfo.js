import { getEventsByOwner } from '../data.js';
import { showError } from '../notification.js';

export default async function userInfo() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    userInfoForm: await this.load('./templates/user/userInfoForm.hbs'),
  };

  try {
    const events = await getEventsByOwner();
      this.app.userData.events = events.map((x) => ({ 'name': x.name }));
    this.app.userData.eventsCount = this.app.userData.events.length;
    if (this.app.userData.eventsCount > 0) {
      this.app.userData.isIvents = true;
    } else {
      this.app.userData.isIvents = false;
    }

    if (events.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, events);
      throw error;
    }

    const context = Object.assign({}, this.app.userData);
    this.partial('./templates/user/userInfo.hbs', context);
  } catch (x) {
    showError(x.message);
  }
}
