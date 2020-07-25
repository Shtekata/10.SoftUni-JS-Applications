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
  return fetch(host(endpoints.REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  }).then((x) => x.json());
}

export async function login(username, password) {
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
  return result;
}

export async function logout() {
  const token = localStorage.getItem('userToken');
  const result = await fetch(host(endpoints.LOGOUT), {
    headers: { 'user-token': token },
  });
  localStorage.removeItem('userToken', result['user-token']);
  localStorage.removeItem('username', result.username);
  localStorage.removeItem('userId', result.objectId);
  return result;
}

export function getMovies() {
  const token = localStorage.getItem('userToken');
  return fetch(host(endpoints.MOVIES), {
    method: 'GET',
    headers: { 'user-token': token },
  }).then((x) => x.json());
}

export function getMovieById(id) {
  const token = localStorage.getItem('userToken');
  return fetch(host(`${endpoints.MOVIES}/${id}`), {
    method: 'GET',
    headers: { 'user-token': token },
  }).then((x) => x.json());
}

export function createMovie(movie) {
  const token = localStorage.getItem('userToken');
  return fetch(host(endpoints.MOVIES), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
    body: JSON.stringify(movie),
  }).then((x) => x.json());
}

export function editMovie(movie) {
  const token = localStorage.getItem('userToken');
  return fetch(host(`${endpoints.MOVIES}/${movie.objectId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
    body: JSON.stringify(movie),
  }).then((x) => x.json());
}

export function deleteMovie(movie) {
  const token = localStorage.getItem('userToken');
  return fetch(host(`${endpoints.MOVIES}/${movie.objectId}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
  }).then((x) => x.json());
}

export function buyTicket(movie) {
  movie.tickets--;
  return editMovie(movie);
}

export function getMoviesByOwner() {
  const token = localStorage.getItem('userToken');
  const userId = localStorage.getItem('userId');
  return fetch(host(`${endpoints.SEARCH}'${userId}'`), {
    method: 'GET',
    headers: { 'user-token': token },
  }).then((x) => x.json());
}
