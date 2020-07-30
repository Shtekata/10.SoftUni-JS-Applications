import { beginRequest, endRequest, showError } from './notification.js';
import API from './api.js';

const endpoints = {
  MOVIES: 'data/movies',
  SEARCH: 'data/movies?where=ownerId=',
};

const api = new API(
  '16E1323D-9CE2-F98F-FF1A-E326A245B400',
  '832E2858-0FAD-450B-A2B1-58DFA22067D9',
  beginRequest,
  endRequest
);

export const login = api.login.bind(api);
export const register = api.register.bind(api);
export const logout = api.logout.bind(api);

export async function getMovies(search) {
  if (!search) {
    return await api
      .get(endpoints.MOVIES + '?pageSize=100&offset=0')
      .then((x) => x.json());
  } else {
    return await api
      .get(`${endpoints.MOVIES}?where=${escape(`genres LIKE '%${search}%'`)}`)
      .then((x) => x.json());
  }
}

export function getMovieById(id) {
  return api.get(`${endpoints.MOVIES}/${id}`);
}

export function createMovie(movie) {
  return api.post(endpoints.MOVIES, movie);
}

export function editMovie(movie) {
  return api.put(`${endpoints.MOVIES}/${movie.objectId}`, movie);
}

export function deleteMovie(id) {
  return api.delete(`${endpoints.MOVIES}/${id}`);
}

export function buyTicket(movie) {
  beginRequest();
  movie.tickets--;
  endRequest();
  return editMovie(movie);
}

export async function getMoviesByOwner() {
  const userId = localStorage.getItem('userId');
  return await api.get(`${endpoints.SEARCH}'${userId}'`).then((x) => x.json());
  // return api.get(`${endpoints.MOVIES}?where=ownerId%3D%27${userId}%27`);
}
