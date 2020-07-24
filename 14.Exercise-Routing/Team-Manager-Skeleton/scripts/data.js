function host(endpoint) {
  return `https://api.backendless.com/254EC0BC-2AA7-E3D0-FF14-EA87168A7B00/DBD0E9EF-F63D-4FFF-A8AA-57ED15D9A01E/${endpoint}`;
}

const endpoints = {
  REGISTER: 'users/register',
  LOGIN: 'users/login',
  TEAMS: 'data/teams',
  UPDATE_USER: 'users/',
  LOGOUT: 'users/logout',
};

export async function register(username, password) {
  return await fetch(host(endpoints.REGISTER), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((x) => x.json());
}

export async function login(username, password) {
  return await fetch(host(endpoints.LOGIN), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      login: username,
      password,
    }),
  }).then((x) => x.json());
}

export async function logout() {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not logged in');
  }

  return await fetch(host(endpoints.LOGOUT), {
    method: 'GET',
    headers: {
      'user-token': token,
    },
  });
}

// export async function createTeam(name, comment) {
//   return await fetch(host(endpoints.TEAMS), {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       name,
//       comment,
//     }),
//   }).then((x) => x.json());
// }

async function setUserTeamId(userId, teamId) {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not logged in');
  }

  return await fetch(host(`${endpoints.UPDATE_USER}${userId}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'user-token': token,
    },
    body: JSON.stringify(teamId),
  }).then((x) => x.json());
}

export async function createTeam(team) {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not logged in');
  }

  const result = await fetch(host(endpoints.TEAMS), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'user-token': token,
    },
    body: JSON.stringify(team),
  }).then((x) => x.json());

  if (result.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, result);
    throw error;
  }

  const userUpdateResult = await setUserTeamId(result.ownerId, result.objectId);
  if (userUpdateResult.hasOwnProperty('errorData')) {
    const error = new Error();
    Object.assign(error, userUpdateResult);
    throw error;
  }

  return result;
}

export async function getTeams() {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not logged in');
  }

  return await fetch(host(endpoints.TEAMS), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'user-token': token,
    },
  }).then((x) => x.json());
}

export async function getTeamById(id) {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('User is not logged in');
  }

  return await fetch(host(`${endpoints.TEAMS}/${id}`), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'user-token': token,
    },
  }).then((x) => x.json());
}
