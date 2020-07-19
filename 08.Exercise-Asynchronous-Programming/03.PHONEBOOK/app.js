import * as api from './data.js';
import el from './dom.js';

window.addEventListener('load', () => {
  const list = document.querySelector('#phonebook');
  const inputPerson = document.querySelector('#person');
  const inputPhone = document.querySelector('#phone');

  document.querySelector('#btnLoad').addEventListener('click', renderPhonebook);
  document.querySelector('#btnCreate').addEventListener('click', addNew);

  async function renderPhonebook() {
    const data = await api.getData();
    list.innerHTML = '';
    Object.entries(data).forEach(([key, value]) => createElement(key, value));
  }

  function createElement(id, entry) {
    const button = el('button', 'Delete');
    const element = el('li', [
      el('span', `${entry.person}: ${entry.phone}`),
      button,
    ]);

    button.addEventListener('click', async () => {
      try {
        button.textContent = 'Please wait...';
        button.disabled = true;
        await api.deleteEntry(id);
        element.remove();
      } catch (err) {
        button.textContent = 'Delete';
        button.disabled = false;
        alert(err);
        console.error(err);
      }
    });

    list.appendChild(element);
  }

  async function addNew() {
    const person = inputPerson.value;
    const phone = inputPhone.value;
    const entry = { person, phone };

    const result = await api.createEntry(entry);
    const id = Object.keys(result)[0];
    createElement(id, result[id]);

    inputPerson.value = '';
    inputPhone.value = '';
  }
});
