export default async function home() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };
  // this.swap('<img class="background" src="images/background.jpg">');
  this.partial('./templates/home.hbs', this.app.userData);
}