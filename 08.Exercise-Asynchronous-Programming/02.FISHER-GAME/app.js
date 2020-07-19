// function attachEvents() {
//     console.log('TODO...');
// }

// attachEvents();
import * as api from './data.js';

window.addEventListener('load', async () => {
  const mainEl = document.querySelector('#main');

  const listString = await fetch('./main.hbs').then((x) => x.text());
  const listTemplate = Handlebars.compile(listString);
  Handlebars.registerPartial(
    'catch',
    await fetch('./catch.hbs').then((x) => x.text())
  );

  const createForm = document.querySelector('#addForm');
  const fields = {
    angler: createForm.querySelector('.angler'),
    bait: createForm.querySelector('.bait'),
    captureTime: createForm.querySelector('.captureTime'),
    location: createForm.querySelector('.location'),
    species: createForm.querySelector('.species'),
    weight: createForm.querySelector('.weight'),
  };
  createForm.querySelector('.add').addEventListener('click', createCatch);

  document.querySelector('.load').addEventListener('click', loadCatches);

  async function loadCatches() {
    const catches = await api.getCatches();

    const html = listTemplate({ catches });
    mainEl.innerHTML = html;

    const container = document.querySelector('#catches');
    container.addEventListener('click', (x) => {
      if (x.target.tagName !== 'BUTTON') return;
      if (x.target.className === 'update') {
        updateCatch(x.target.parentNode);
      } else {
        deleteCatch(x.target.parentNode);
      }
    });
  }

  async function createCatch() {
    const newCatch = {
      angler: fields.angler.value,
      bait: fields.bait.value,
      captureTime: fields.captureTime.value,
      location: fields.location.value,
      species: fields.species.value,
      weight: fields.weight.value,
    };

    try {
      await api.createCatch(newCatch);
      loadCatches();
    } catch (err) {
      alert('Something went wrong!');
      console.err(err);
    }
  }

  async function updateCatch(element) {
    const id = element.getAttribute('data-id');
    const edited = {
      angler: element.querySelector('.angler').value,
      bait: element.querySelector('.bait').value,
      captureTime: element.querySelector('.captureTime').value,
      location: element.querySelector('.location').value,
      species: element.querySelector('.species').value,
      weight: element.querySelector('.weight').value,
    };

    try {
      await api.updateCatch(id, edited);
    } catch (err) {
      alert('Something went wrong!');
      console.err(err);
    }
  }

  async function deleteCatch(element) {
    const id = element.getAttribute('data-id');
    try {
      await api.deleteCatch(id);
      element.remove();
    } catch (err) {
      alert('Something went wrong!');
      console.err(err);
    }
  }
});
