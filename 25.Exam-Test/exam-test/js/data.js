import API from './api.js';

const endpoints = {
  MOVIES: 'data/movies',
  MOVIES_BY_ID: 'data/movies/',
};

const api = new API(
  'DE4A15FA-828F-F888-FFA8-5B2EC9637E00',
  'ABE786E5-64FE-4300-84B1-4ACC2383E488'
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getAll() {
  return api.get(endpoints.MOVIES);
}

export async function createMovie(movie) {
  return api.post(endpoints.MOVIES, movie);
}

export async function getMovieById(id) {
  return api.get(`${endpoints.MOVIES_BY_ID}${id}`);
}

export async function editMovie(id, movie) {
  return api.put(`${endpoints.MOVIES_BY_ID}${id}`, movie);
}

export async function deleteMovie(id) {
  return api.delete(`${endpoints.MOVIES_BY_ID}${id}`);
}

export async function likeMovie(id) {
  const movie = await getMovieById(id);
  movie.likes = movie.likes + 1;
  return editMovie(id, movie);
}

export function checkResult(result) {
  if (result.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, result);
    throw error;
  }
}
