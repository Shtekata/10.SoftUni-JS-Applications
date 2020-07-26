import { beginRequest, endRequest } from './notification.js';

function host(endpoint) {
  return `https://api.backendless.com/16E1323D-9CE2-F98F-FF1A-E326A245B400/832E2858-0FAD-450B-A2B1-58DFA22067D9/${endpoint}`;
}

const endpoints = {
  REGISTER: 'users/register',
  LOGIN: 'users/login',
  LOGOUT: 'users/logout',
  MOVIES: 'data/movies',
  SEARCH: 'data/movies?where=ownerId=',
};

export function register(username, password) {
  beginRequest();
  const result = fetch(host(endpoints.REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then((x) => x.json());
  endRequest();
  return result;
}

export async function login(username, password) {
  beginRequest();
  const result = await fetch(host(endpoints.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login: username, password }),
  }).then((x) => x.json());
  localStorage.setItem('userToken', result['user-token']);
  localStorage.setItem('username', result.username);
  localStorage.setItem('userId', result.objectId);
  endRequest();
  return result;
}

export async function logout() {
  beginRequest();
  const token = localStorage.getItem('userToken');
  const result = await fetch(host(endpoints.LOGOUT), {
    headers: { 'user-token': token },
  });
  localStorage.removeItem('userToken', result['user-token']);
  localStorage.removeItem('username', result.username);
  localStorage.removeItem('userId', result.objectId);
  endRequest();
  return result;
}

export function getMovies(search) {
  beginRequest();
  const token = localStorage.getItem('userToken');

  let result;

  if (!search) {
    result = fetch(host(endpoints.MOVIES), {
      method: 'GET',
      headers: { 'user-token': token },
    }).then((x) => x.json());
  } else {
    result = fetch(
      host(`${endpoints.MOVIES}?where=${escape(`genres LIKE '%${search}%'`)}`),
      {
        method: 'GET',
        headers: { 'user-token': token },
      }
    ).then((x) => x.json());
  }
  endRequest();
  return result;
}

export function getMovieById(id) {
  beginRequest();
  const token = localStorage.getItem('userToken');
  const result = fetch(host(`${endpoints.MOVIES}/${id}`), {
    method: 'GET',
    headers: { 'user-token': token },
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function createMovie(movie) {
  beginRequest();
  const token = localStorage.getItem('userToken');
  const result = fetch(host(endpoints.MOVIES), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
    body: JSON.stringify(movie),
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function editMovie(movie) {
  beginRequest();
  const token = localStorage.getItem('userToken');
  const result = fetch(host(`${endpoints.MOVIES}/${movie.objectId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
    body: JSON.stringify(movie),
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function deleteMovie(id) {
  beginRequest();
  const token = localStorage.getItem('userToken');
  const result = fetch(host(`${endpoints.MOVIES}/${id}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function buyTicket(movie) {
  beginRequest();
  movie.tickets--;
  endRequest();
  return editMovie(movie);
}

export function getMoviesByOwner() {
  beginRequest();
  const token = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  const result = fetch(host(`${endpoints.SEARCH}'${userId}'`), {
    method: 'GET',
    headers: { 'user-token': token },
  }).then((x) => x.json());
  endRequest();
  return result;
}
