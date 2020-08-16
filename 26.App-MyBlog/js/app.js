import home, {
  createGet,
  createPost,
  editGet,
  editPost,
  detailsGet,
  like,
  deletePost,
} from './controllers/post.js';
import {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  logout,
} from './controllers/user.js';

window.addEventListener('load', () => {
  const app = Sammy('#root', function () {
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
    this.get('#/create-post', createGet);
    this.get('#/edit-post/:id', editGet);
    this.get('#/details/:id', detailsGet);
    this.get('#/like/:id', like);
    this.get('#/delete/:id', deletePost);

    this.post('#/login', (x) => {
      loginPost.call(x);
    });
    this.post('#/register', (x) => {
      registerPost.call(x);
    });
    this.post('#/create-post', (x) => {
      createPost.call(x);
    });
    this.post('#/edit-post/:id', (x) => {
      editPost.call(x);
    });

    this.get('', () => {
      this.swap('<h1>404 Page not found!</h1>');
    });
  });
  app.run();
});
