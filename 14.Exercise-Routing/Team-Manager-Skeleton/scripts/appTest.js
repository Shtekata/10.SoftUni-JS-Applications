$(() => {
  const app = Sammy('#main', function (context) {
    this.use('Handlebars', 'hbs');
    console.log(this);
    this.get('index.html', function (context) {
      console.log(this);
      this.render('/templates/register/registerForm.hbs').then(function (html) {
        console.log(this);
        this.swap(html);
      });
    });
  });

  app.run();
});
