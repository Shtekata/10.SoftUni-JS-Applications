import { getEventById } from '../../data.js';
import { showError } from '../../notification.js';

export default async function details() {
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
          Object.assign(error,event)
      }

      event.ownerId === sessionStorage.userId ? this.app.userData.isOwner = true : this.app.userData.isOwner = false;
      const context = Object.assign({ event }, this.app.userData);
      this.partial('./templates/event/details.hbs', context);
  } catch (x) {
      showError(x.message);
  }
}
