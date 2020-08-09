import { editEvent, getEventById } from '../../data.js';
import { showInfo, showError } from '../../notification.js';

export default async function join() {
  try {
    const objectId = this.params.id;
    let event = this.app.userData.events.find((x) => x.objectId == objectId);
    if (event === undefined) {
      event = await getEventById(objectId);
    }

    event.peoples++;

    const result = await editEvent(event);
    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    for (let i = 0; i < this.app.userData.events.length; i++) {
      if (this.app.userData.events[i].objectId == event.objectId) {
        this.app.userData.events.splice(i, 1, result);
      }
    }

    showInfo('You join the event successfully.');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}