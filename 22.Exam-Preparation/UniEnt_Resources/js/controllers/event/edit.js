import { editEvent, getEventById } from '../../data.js';
import { showInfo, showError } from '../../notification.js';

export default async function edit() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  try {
    const objectId = this.params.id;
    let event = this.app.userData.events.find((x) => x.objectId == objectId);
    if (event === undefined) {
      event = await getEventById(objectId);
    }

    if (event.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, event);
      throw error;
    }

    const context = Object.assign({ event }, this.app.userData);
    this.partial('./templates/event/edit.hbs', context);
  } catch (x) {
    showError(x.message);
  }
}

export async function editPost() {
  try {
    if (this.params.name.length < 6) {
      throw new Error(
        'The name of the event must be at least 6 English letters.'
      );
    }
    const res = this.params.dateTime.match(/^[0-2]?[0-9]{1} [a-z,A-Z]+/g);
    if (!res) {
      throw new Error('The event date and time should be a valid.');
    }
    if (this.params.description.length < 10) {
      throw new Error(
        'The event description should be at least 10 characters.'
      );
    }
    if (
      !this.params.imageURL.startsWith('http://') &&
      !this.params.imageURL.startsWith('https://')
    ) {
      throw new Error('Image URL should start with http://...or http://');
    }

    const event = {
      objectId: this.params.id,
      name: this.params.name,
      dateTime: this.params.dateTime,
      description: this.params.description,
      imageURL: this.params.imageURL,
    };

    const result = await editEvent(event);
    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
      }
      
      for (let i = 0; i < this.app.userData.events.length; i++){
          if (this.app.userData.events[i].objectId == event.objectId) {
              this.app.userData.events.splice(i, 1, result);
          }
      }

    showInfo('Event edited successfully.');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}
