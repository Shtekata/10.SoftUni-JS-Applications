import el, { p, contentDiv, button } from 'dom.js';

function app() {
  const element = el('div', [p('Some text')]);

  contentDiv(element);

  document.body.appendChild(element);

  const btn = button('Submit');

  btn.disable();
}
