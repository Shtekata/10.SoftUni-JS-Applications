import { showInfo, showError } from '../../notification.js';
import { createEvent } from '../../data.js'

export default async function create() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
  };
  this.partial('./templates/event/create.hbs');
}

export async function createPost() {
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
      name: this.params.name,
      dateTime: this.params.dateTime,
      description: this.params.description,
      imageURL: this.params.imageURL,
    };

    const result = await createEvent(event);
    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    showInfo('Event created successfully.');
    this.redirect('/');
  } catch (x) {
    showError(x.message);
  }
}
