import home from './controllers/home.js';
import register, { registerPost } from './controllers/register.js';
import login, { loginPost } from './controllers/login.js';
import logout from './controllers/logout.js';
import catalog, {
  create,
  details,
  edit,
  createPost,
  buyTicket,
  myMovies,
  editPost,
  deleteMovie,
} from './controllers/movies.js';

window.addEventListener('load', () => {
  const app = Sammy('#container', function () {
    this.use('Handlebars', 'hbs');

    this.userData = {
      username: localStorage.getItem('username') || '',
      userId: localStorage.getItem('userId') || '',
      movies: [],
    };

    this.get('/', home);
    this.get('index.html', home);
    this.get('#/home', home);
    this.get('#/register', register);
    this.get('#/login', login);
    this.get('#/logout', logout);
    this.get('#/catalog', catalog);
    this.get('#/create', create);
    this.get('#/details/:id', details);
    this.get('#/edit/:id', edit);
    this.get('#/buy/:id', buyTicket);
    this.get('#/my_movies', myMovies);
    this.get('#/delete/:id', deleteMovie);

    this.post('#/register', (x) => {
      registerPost.call(x);
    });
    this.post('#/login', (x) => {
      loginPost.call(x);
    });
    this.post('#/create', (x) => {
      createPost.call(x);
    });
    this.post('#/edit/:id', (x) => {
      editPost.call(x);
    });
  });

  app.run();
});
