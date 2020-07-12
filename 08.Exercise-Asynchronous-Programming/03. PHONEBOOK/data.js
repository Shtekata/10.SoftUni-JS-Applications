function host(endpoint) {
  return `http://localhost:8000/phonebook/${endpoint || ''}`;
}

export async function getData() {
  const data = fetch(host()).then((x) => x.json());
  return data;
}

// export function deleteEntry(id) {
//   return fetch(host(id), { method: 'DELETE' });
// }
export function deleteEntry(id) {
  return new Promise((resolve, reject) => {
    // return setTimeout(() => reject('Cannot delete entry'), 1500);
    fetch(host(id), { method: 'DELETE' })
      .then((x) => setTimeout(resolve, 1500))
      .catch((x) => reject(x));
  });
}

export async function createEntry(entry) {
  return fetch(host(), {
    method: 'POST',
    body: JSON.stringify(entry),
  }).then((x) => x.json());
}
