import { getEvents } from '../data.js';
import { showError } from '../notification.js';

export default async function home() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    homeGuest: await this.load('./templates/home/homeGuest.hbs'),
    homeNoEvents: await this.load('./templates/home/homeNoEvents.hbs'),
    event: await this.load('./templates/event/event.hbs'),
  };

  try {
    const token = sessionStorage.getItem('userToken');
    let context = this.app.userData;
    let events = [];

    if (token) {
      const search = this.params.search || '';
      events = await getEvents(search);
      events.sort((x, y) => y.peoples - x.peoples);
      this.app.userData.events = events;
      context = Object.assign({ search }, this.app.userData);
    }

    if (events.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, events);
      throw error;
    }

    this.partial('./templates/home/home.hbs', context);
  } catch (x) {
    showError(x.message);
  }
}
