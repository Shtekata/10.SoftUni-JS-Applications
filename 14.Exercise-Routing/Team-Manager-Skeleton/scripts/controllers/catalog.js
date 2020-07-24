import { getTeams } from '../data.js';

export default async function () {
  this.partials = {
    header: await this.load('/templates/common/header.hbs'),
    footer: await this.load('/templates/common/footer.hbs'),
    team: await this.load('/templates/catalog/team.hbs'),
  };

  // const data = Object.assign({}, this.app.userData);
  // data.teams = [
  //   {
  //     teamId: '123123',
  //     name: 'Cherry',
  //     comment: 'Some content',
  //   },
  //   {
  //     teamId: '31234',
  //     name: 'Apple',
  //     comment: 'Some content',
  //   },
  //   {
  //     teamId: '4134',
  //     name: 'Banana',
  //     comment: 'Some content',
  //   },
  // ];

  try {
    const teams = await getTeams();
    const data = Object.assign({ teams }, this.app.userData);
    data.teams = data.teams.map((x) => ({
      teamId: x.objectId,
      name: x.name,
      comment: x.comment,
    }));
    this.partial('/templates/catalog/teamCatalog.hbs', data);

    if (data.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, data);
      throw error;
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
