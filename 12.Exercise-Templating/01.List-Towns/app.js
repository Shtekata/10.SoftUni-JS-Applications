window.addEventListener('load', async () => {
  //   const templateString = '<h1>This is {{label}} heading </h1><div>{{text}}';
  //   const templateString = document.querySelector('#main-template').innerHTML;
  const templateString = await fetch('./main-template.hbs').then((x) =>
    x.text()
  );
  //   Handlebars.registerPartial(
  //     'town',
  //     document.querySelector('#town-template').innerHTML
  //   );
  Handlebars.registerPartial(
    'town',
    await fetch('./town-template.hbs').then((x) => x.text())
  );

  const templateFn = Handlebars.compile(templateString);
  const input = document.querySelector('#towns');
  const rootEl = document.querySelector('#root');

  document
    .querySelector('#btnLoadTowns')
    .addEventListener('click', renderTowns);

  function renderTowns(x) {
    x.preventDefault();

    // const generatedHtml = templateFn({
    //   label: 'an interpolated',
    //   text: 'Ala bala',
    // });

    const towns = input.value.split(', ');
    const generatedHtml = templateFn({ towns });
    rootEl.innerHTML = generatedHtml;
  }
});
