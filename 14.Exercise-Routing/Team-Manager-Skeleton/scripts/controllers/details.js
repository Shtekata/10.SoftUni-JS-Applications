import { getTeamById } from '../data.js';

export default async function () {
  this.partials = {
    header: await this.load('/templates/common/header.hbs'),
    footer: await this.load('/templates/common/footer.hbs'),
    teamMember: await this.load('/templates/catalog/teamMember.hbs'),
    teamControls: await this.load('/templates/catalog/teamControls.hbs'),
  };

  //   const data = Object.assign({}, this.app.userData);

  //   data.teamId = '123123';
  //   data.name = 'Cherry';
  //   data.comment = 'Some content';
  //   data.members = [
  //     {
  //       username: 'CherryCherry',
  //     },
  //     {
  //       username: 'AppleApple',
  //     },
  //     {
  //       username: 'BananaBanana',
  //     },
  //   ];

  // const data = {
  //   teamId: '123123',
  //   name: 'Cherry',
  //   comment: 'Some content',
  //   members: [
  //     {
  //       username: 'Peter',
  //     },
  //     {
  //       username: 'George',
  //     },
  //     {
  //       username: 'Mary',
  //     },
  //   ],
  //   isAuthor: true,
  // };

  // Object.assign(data, this.app.userData);

  try {
    const data = await getTeamById(this.params.id);
    Object.assign(data, this.app.userData);

    if (data.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, data);
      throw error;
    }

    if (data.ownerId === this.app.userData.userId) {
      data.isAuthor = true;
    }

    if (data.objectId === this.app.userData.teamId) {
      data.isOnTeam = true;
    }

    this.partial('/templates/catalog/details.hbs', data);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
