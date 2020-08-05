import { deleteEvent as apiDeleteEvent } from '../../data.js';
import { showInfo, showError } from '../../notification.js';

export default async function deleteEvent() {
  if (confirm('Are you sure you want to delete this event?') == false) {
    return this.redirect('/');
  }

  try {
    const objectId = this.params.id;
    const result = await apiDeleteEvent(objectId);
    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    showInfo('Event closed successfully.');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
    this.redirect('/');
  }
}
