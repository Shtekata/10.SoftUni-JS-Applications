import { showInfo, showError } from '../notification.js';
import {
  createMovie,
  getMovies,
  buyTicket as apiBuyTicket,
  getMoviesByOwner,
  getMovieById,
  editMovie,
  deleteMovie as apiDeleteMovie,
} from '../dataOld.js';

export default async function catalog(api) {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    movie: await this.load('./templates/movie/movie.hbs'),
    controls: await this.load('./templates/movie/movieControls.hbs'),
  };

  const search = this.params.search || '';

  // const movies = await api.getMovies(search);
  const movies = await getMovies(search);
  this.app.userData.movies = movies;
  const context = Object.assign(
    { myMovies: false, origin: encodeURIComponent('#/catalog'), search },
    this.app.userData
  );

  this.partial('./templates/movie/catalog.hbs', context);
}

export async function create() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };
  this.partial('./templates/movie/create.hbs', this.app.userData);
}

export async function createPost() {
  try {
    if (this.params.title.length === 0) {
      throw new Error('Title is required');
    }
    if (this.params.imageUrl.length === 0) {
      throw new Error('Image is required');
    }
    if (+this.params.tickets < 0) {
      throw new Error('Ticket must be bigger than zero');
    }

    const movie = {
      title: this.params.title,
      image: this.params.imageUrl,
      description: this.params.description,
      genres: this.params.genres,
      tickets: +this.params.tickets,
    };

    const result = await createMovie(movie);
    if (result.hasOwnProperty('errorData')) {
      // throw new Error(result.message);
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }
    showInfo('Movie created');
    this.redirect(`#/details/${result.objectId}`);
  } catch (err) {
    showError(err.message);
  }
}

export async function details() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };

  try {
    const objectId = this.params.id;
    let movie = this.app.userData.movies.find((x) => x.objectId == objectId);
    if (movie === undefined) {
      movie = await getMovieById(objectId);
    }

    if (movie.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    const context = Object.assign(
      { movie, origin: encodeURIComponent(`#/details/${objectId}`) },
      this.app.userData
    );
    this.partial('./templates/movie/details.hbs', context);
    showInfo(`Details for ${movie.title}`);
  } catch (err) {
    showError(err.message);
  }
}

export async function edit() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
  };
  try {
    const objectId = this.params.id;
    let movie = this.app.userData.movies.find((x) => x.objectId == objectId);
    if (movie === undefined) {
      movie = await getMovieById(objectId);
    }
    const context = Object.assign({ movie }, this.app.userData);
    this.partial('./templates/movie/edit.hbs', context);

    if (movie.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }
  } catch (err) {
    showError(err.message);
  }
}

export async function editPost() {
  try {
    if (this.params.title.length === 0) {
      throw new Error('Title is required');
    }
    if (this.params.imageUrl.length === 0) {
      throw new Error('Image is required');
    }
    if (+this.params.tickets < 0) {
      throw new Error('Ticket must be bigger than zero');
    }

    const movieId = this.params.id;

    const movie = {
      objectId: movieId,
      title: this.params.title,
      image: this.params.imageUrl,
      description: this.params.description,
      genres: this.params.genres,
      tickets: +this.params.tickets,
    };
    const result = await editMovie(movie);

    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    for (let i = 0; i < this.app.userData.movies.length; i++) {
      if (this.app.userData.movies[i].objectId == movieId) {
        this.app.userData.movies.splice(i, 1, result);
      }
    }

    showInfo(`Edited movie ${movie.title}`);
    this.redirect(`#/details/${result.objectId}`);
  } catch (err) {
    showError(err.message);
  }
}

export async function buyTicket() {
  try {
    const objectId = this.params.id;
    let movie = this.app.userData.movies.find((x) => x.objectId == objectId);
    if (movie === undefined) {
      movie = await getMovieById(objectId);
    }
    if (movie.tickets == 0) {
      throw new Error("Don't have tickets for this film");
    }
    const result = await apiBuyTicket(movie);

    if (result.hasOwnProperty('errorData')) {
      // throw new Error(result.message);
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    showInfo(`Bought ticket for ${movie.title}`);
    this.redirect(this.params.origin);
  } catch (err) {
    showError(err.message);
    this.redirect(this.params.origin);
  }
}

export async function myMovies() {
  this.partials = {
    header: await this.load('./templates/common/header.hbs'),
    footer: await this.load('./templates/common/footer.hbs'),
    movie: await this.load('./templates/movie/movie.hbs'),
    controls: await this.load('./templates/movie/ownMovieControls.hbs'),
    movieControls: await this.load('./templates/movie/movieControls.hbs'),
  };

  const movies = await getMoviesByOwner();
  this.app.userData.movies = movies;

  const context = Object.assign(
    { myMovies: true, origin: encodeURIComponent('#/my_movies') },
    this.app.userData
  );

  this.partial('./templates/movie/catalog.hbs', context);
}

export async function deleteMovie() {
  if (confirm('Are you sure you want to delete this movie?') == false) {
    return this.redirect('#/my_movies');
  }

  const objectId = this.params.id;

  try {
    let movie = this.app.userData.movies.find((x) => x.objectId == objectId);
    // if (movie !== undefined) {
    //   const newMovies=this.app.userData.movies.filter(
    //     (x) => x.objectId !== objectId
    //   );
    //   this.app.userData.movies = newMovies;
    // }

    const result = await apiDeleteMovie(objectId);

    if (result.hasOwnProperty('errorData')) {
      const error = new Error();
      Object.assign(error, result);
      throw error;
    }

    showInfo(`Delete movie ${movie.title}`);
    this.redirect('#/my_movies');
  } catch (err) {
    showError(err.message);
    this.redirect('#/my_movies');
  }
}
