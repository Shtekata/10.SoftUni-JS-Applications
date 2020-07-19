// $(() => {
//     // TODO
// })
import monkeys from './monkeys.js';
window.addEventListener('load', async () => {
  const mainEl = document.querySelector('section');

  const mainString = await fetch('./main.hbs').then((x) => x.text());
  const mainTemplate = Handlebars.compile(mainString);
  Handlebars.registerPartial(
    'monkey',
    await fetch('./monkey.hbs').then((x) => x.text())
  );

  const html = mainTemplate({ monkeys });
  mainEl.innerHTML = html;

  const monkeysEl = document.querySelector('.monkeys');
  monkeysEl.addEventListener('click', onclick);

  function onclick(x) {
    if (x.target.tagName !== 'BUTTON') return;
    const p = x.target.parentNode.querySelector('p');
    p.style.display == 'none'
      ? (p.style.display = '')
      : (p.style.display = 'none');
  }
});
