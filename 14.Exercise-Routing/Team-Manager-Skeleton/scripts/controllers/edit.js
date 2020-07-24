export default async function () {
  this.partials = {
    header: await this.load('/templates/common/header.hbs'),
    footer: await this.load('/templates/common/footer.hbs'),
    editForm: await this.load('/templates/edit/editForm.hbs'),
  };

  const data = {
    teamId: '123123',
    name: 'Cherry',
    comment: 'Some content',
  };

  Object.assign(data, this.app.userData);

  this.partial('/templates/edit/editPage.hbs', data);
}
