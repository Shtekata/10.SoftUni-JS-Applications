import home, {
  createGetEntity,
  createPostEntity,
  editGetEntity,
  editPostEntity,
  detailsEntity,
  collectEntity,
  deleteEntity,
} from './controllers/entity.js';
import {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  logout,
} from './controllers/user.js';

window.addEventListener('load', () => {
  const app = Sammy('main', function () {
    this.use('Handlebars', 'hbs');

    this.userData = {
      email: sessionStorage.getItem('email') || '',
      userId: sessionStorage.getItem('userId') || '',
    };

    this.get('/', home);
    this.get('#/home', home);
    this.get('index.html', home);
    this.get('#/login', loginGet);
    this.get('#/register', registerGet);
    this.get('#/logout', logout);
    this.get('#/create', createGetEntity);
    this.get('#/edit/:id', editGetEntity);
    this.get('#/details/:id', detailsEntity);
    this.get('#/collect/:id', collectEntity);
    this.get('#/delete/:id', deleteEntity);

    this.post('#/login', (x) => {
      loginPost.call(x);
    });
    this.post('#/register', (x) => {
      registerPost.call(x);
    });
    this.post('#/create', (x) => {
      createPostEntity.call(x);
    });
    this.post('#/edit/:id', (x) => {
      editPostEntity.call(x);
    });

    this.get('', () => {
      this.swap('<h1>404 Page not found!</h1>');
    });
  });
  app.run();
});
