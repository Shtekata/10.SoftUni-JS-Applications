import { createTeam } from '../data.js';

export default async function () {
  this.partials = {
    header: await this.load('/templates/common/header.hbs'),
    footer: await this.load('/templates/common/footer.hbs'),
    createForm: await this.load('/templates/create/createForm.hbs'),
  };
  this.partial('/templates/create/createPage.hbs', this.app.userData);
}

export async function createPost() {
  try {
    const newTeam = {
      name: this.params.name,
      comment: this.params.comment,
    };

    // Object.values(newTeam).forEach((x) => {
    //   if (x.lenght == 0) {
    //     alert('All fields are required!');
    //     return;
    //   }
    // });
    if (Object.values(newTeam).some((x) => x.length == 0)) {
      alert('All fields required!');
      return;
    }

    // const result = await createTeam(newTeam.name, newTeam.comment);
    const result = await createTeam(newTeam);

    this.app.userData.hasTeam = true;
    this.app.userData.teamId = result.objectId;
    this.app.userData.ownerId = result.ownerId;
    this.redirect(`#/catalog/${result.objectId}`);

    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
