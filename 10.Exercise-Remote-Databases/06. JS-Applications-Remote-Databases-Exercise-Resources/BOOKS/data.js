const appId = '9F847834-487D-638E-FF21-5E0B44E53400';
const apiKey = 'F40D1D73-C07B-4FFD-9CC7-A5EE482F93C7';

function host(endpoint) {
  return `https://api.backendless.com/${appId}/${apiKey}/data/${endpoint}`;
}

export async function getBooks() {
  return await fetch(host('books')).then((x) => x.json());
}

export async function createBook(book) {
  //   throw new Error('Gotcha');
  const response = await fetch(host('books'), {
    method: 'POST',
    body: JSON.stringify(book),
    headers: {
      'Content-type': 'application/json',
    },
  });
  return await response.json();
}

export async function updateBook(book) {
  const id = book.objectId;
  const response = await fetch(host(`books/${id}`), {
    method: 'PUT',
    body: JSON.stringify(book),
    headers: {
      'Content-type': 'application/json',
    },
  });
  return await response.json();
}

export async function deleteBook(id) {
  const response = await fetch(host(`books/${id}`), {
    method: 'DELETE',
  });
  return await response.json();
}
