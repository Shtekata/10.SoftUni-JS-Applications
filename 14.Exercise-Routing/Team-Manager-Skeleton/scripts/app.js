import home from './controllers/home.js';
import about from './controllers/about.js';
import register, { registerPost } from './controllers/register.js';
import login, { loginPost } from './controllers/login.js';
import catalog from './controllers/catalog.js';
import details from './controllers/details.js';
import create, { createPost } from './controllers/create.js';
import edit from './controllers/edit.js';
import logout from './controllers/logout.js';

$(() => {
  const app = Sammy('#main', function () {
    this.use('Handlebars', 'hbs');

    this.userData = {
      username: localStorage.getItem('username') || '',
      userId: localStorage.getItem('userId') || '',
      loggedIn: localStorage.getItem('username') || false,
      hasTeam: false,
      isAuthor: false,
      isOnTeam: false,
    };

    this.get('index.html', home);
    this.get('#/home', home);
    this.get('/', home);
    this.get('#/about', about);
    this.get('#/register', register);
    this.get('#/login', login);
    this.get('#/catalog', catalog);
    this.get('#/catalog/:id', details);
    this.get('#/create', create);
    this.get('#/edit/:id', edit);
    this.get('#/logout', logout);

    this.post('#/register', (ctx) => {
      registerPost.call(ctx);
    });
    this.post('#/login', (ctx) => {
      loginPost.call(ctx);
    });
    this.post('#/create', (ctx) => {
      createPost.call(ctx);
    });
  });

  app.run();
});
