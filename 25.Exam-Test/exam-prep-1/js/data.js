import { beginRequest, endRequest } from './notification.js';

function host(endpoint) {
  return `https://api.backendless.com/0133F1F3-62BA-23C7-FF4A-392DB2FDBE00/7CD0CAC8-943D-4939-9036-07E87BBA98FE/${endpoint}`;
}

const endpoints = {
  REGISTER: 'users/register',
  LOGIN: 'users/login',
  LOGOUT: 'users/logout',
  EVENTS: 'data/events',
  SEARCH: 'data/events?where=ownerId=',
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
  sessionStorage.setItem('userToken', result['user-token']);
  sessionStorage.setItem('username', result.username);
  sessionStorage.setItem('userId', result.objectId);
  endRequest();
  return result;
}

export async function logout() {
  beginRequest();
  const token = sessionStorage.getItem('userToken');
  const result = await fetch(host(endpoints.LOGOUT), {
    headers: { 'user-token': token },
  });
  sessionStorage.removeItem('userToken');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userId');
  endRequest();
  return result;
}

export function createEvent(event) {
  beginRequest();
  const token = sessionStorage.getItem('userToken');
  const result = fetch(host(endpoints.EVENTS), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
    body: JSON.stringify(event),
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function getEvents(search) {
  beginRequest();
  const token = sessionStorage.getItem('userToken');

  let result;

  if (!search) {
    result = fetch(host(endpoints.EVENTS), {
      method: 'GET',
      headers: { 'user-token': token },
    }).then((x) => x.json());
  } else {
    result = fetch(
      host(
        `${endpoints.EVENTS}?where=${escape(`diteTime LIKE '%${search}%'`)}`
      ),
      {
        method: 'GET',
        headers: { 'user-token': token },
      }
    ).then((x) => x.json());
  }
  endRequest();
  return result;
}

export function getEventById(id) {
  beginRequest();
  const token = sessionStorage.getItem('userToken');
  const result = fetch(host(`${endpoints.EVENTS}/${id}`), {
    method: 'GET',
    headers: { 'user-token': token },
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function editEvent(event) {
  beginRequest();
  const token = sessionStorage.getItem('userToken');
  const result = fetch(host(`${endpoints.EVENTS}/${event.objectId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
    body: JSON.stringify(event),
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function deleteEvent(id) {
  beginRequest();
  const token = sessionStorage.getItem('userToken');
  const result = fetch(host(`${endpoints.EVENTS}/${id}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'user-token': token },
  }).then((x) => x.json());
  endRequest();
  return result;
}

export function getEventsByOwner() {
    beginRequest();
    const token = sessionStorage.getItem('userToken');
    const userId = sessionStorage.getItem('userId');
    const result = fetch(host(`${endpoints.SEARCH}'${userId}'`), {
        method: 'GET',
        headers: { 'user-token': token },
    }).then(x => x.json());
    endRequest();
    return result;
}