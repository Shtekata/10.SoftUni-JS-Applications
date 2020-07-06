function attachEvents() {
  let contacts = [];
  const baseUrl = 'http://localhost:3000/contacts';

  const personEl = document.querySelector('input#person');
  const phoneEl = document.querySelector('input#phone');
  const phonebook = document.querySelector('ul#phonebook');

  const createContact = document
    .querySelector('button#btnCreate')
    .addEventListener('click', () => {
      const { value: person } = personEl;
      const { value: phone } = phoneEl;

      fetch(baseUrl, {
        method: 'POST',
        body: JSON.stringify({ person, phone }),
      })
        .then((x) => x.json())
        .then((x) => {
          contacts.push(x);
          personEl.value = '';
          phoneEl.value = '';
          clearContacts();
          loadContacts();
        });
    });

  const loadContact = document
    .querySelector('button#btnLoad')
    .addEventListener('click', () => {
      phonebook.innerHTML = '';
      loadContacts();
    });

  function loadContacts() {
    contacts.forEach((x) => {
      const id = Object.keys(x)[0];
      const li = document.createElement('li');
      const btnDel = document.createElement('button');
      btnDel.id = id;
      btnDel.textContent = 'Delete';
      li.textContent = `${x[id].person}:${x[id].phone}`;
      li.appendChild(btnDel);
      phonebook.appendChild(li);
    });
  }

  function clearContacts() {
    [...phonebook.children].forEach((x) => x.remove());
  }

  phonebook.addEventListener('click', (x) => {
    if (x.target.textContent === 'Delete') {
      const cont = contacts[x.target.id];
      contacts.pop(cont);
      x.target.parentElement.remove();
    }
  });
}

attachEvents();
