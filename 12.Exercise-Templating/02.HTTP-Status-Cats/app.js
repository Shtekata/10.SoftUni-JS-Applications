// (() => {
//      renderCatTemplate();

//      function renderCatTemplate() {
//          // TODO: Render cat template and attach events
//      }

// })

window.addEventListener('load', async () => {
  const mainEl = document.querySelector('#allCats');

  const listString = await fetch('./list.hbs').then((x) => x.text());
  const listTemplate = Handlebars.compile(listString);
  Handlebars.registerPartial(
    'cat',
    await fetch('./cat.hbs').then((x) => x.text())
  );

  const html = listTemplate({ cats });
  mainEl.innerHTML = html;

  mainEl.addEventListener('click', onclick);

  function onclick(x) {
    if (x.target.tagName !== 'BUTTON') return;
    const div = x.target.parentNode.querySelector('.status');
    if (div.style.display == 'none') {
      div.style.display = '';
      x.target.textContent = 'Hide status code';
    } else {
      div.style.display = 'none';
      x.target.textContent = 'Show status code';
    }
  }
});
