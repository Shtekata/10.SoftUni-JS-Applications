import home from './controllers/home.js';
import login, { loginPost } from './controllers/login.js';
import register, { registerPost } from './controllers/register.js';
import logout from './controllers/logout.js';
import create, { createPost } from './controllers/event/create.js';
import details from './controllers/event/details.js';
import edit, { editPost } from './controllers/event/edit.js';
import deleteEvent from './controllers/event/delete.js';
import join from './controllers/event/join.js';
import userInfo from './controllers/userInfo.js';

window.addEventListener('load', () => {
  const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    this.userData = {
      username: sessionStorage.getItem('username') || '',
      userId: sessionStorage.getItem('userId') || '',
      events: [],
    };

    this.get('/', home);
    this.get('index.html', home);
    this.get('#/home', home);
    this.get('#/login', login);
    this.get('#/register', register);
    this.get('#/logout', logout);
    this.get('#/create', create);
    this.get('#/details/:id', details);
    this.get('#/edit/:id', edit);
    this.get('#/delete/:id', deleteEvent);
    this.get('#/join/:id', join)
    this.get('#/userInfo/:id', userInfo);

    this.post('#/login', (x) => {
      loginPost.call(x);
    });
    this.post('#/register', (x) => {
      registerPost.call(x);
    });
    this.post('#/create', (x) => {
      createPost.call(x);
    });
    this.post('#/edit/:id', (x) => {
      editPost.call(x);
    });
    this.post('#/join/:id', (x) => {
      joinPost.call(x);
    });
  });
  app.run();
});
