function host(endpoint) {
  return `http://localhost:8000/catches/${
    endpoint === undefined ? (endpoint = '') : endpoint
  }`;
}

export async function getCatches() {
  const result = await fetch(host()).then((x) => x.json());
  return Object.entries(result).map(([x, y]) => Object.assign({}, y, { _id: x }));
}

export async function createCatch(listing) {
  return fetch(host(), {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(listing),
  }).then((x) => x.json());
}

export async function updateCatch(id, listing) {
  return fetch(host(id), {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(listing),
  }).then((x) => x.json());
}

export async function deleteCatch(id) {
  return fetch(host(id), {
    method: 'DELETE',
  });
}
