// import { html, render } from '../node_modules/lit-html/lit-html.js';

// function getExpandingListTemplate(contex) {
//   return html``;
// }

class ExpandingList extends HTMLUListElement {
  constructor() {
    super();
    this.addEventListener('click', this.clickHandler);
    Array.from(this.querySelectorAll('li')).forEach((x) => {
      if (x.children.length > 0) x.classList.add('closed');
    });
  }

  clickHandler(x) {
    const target = x.target;
    if (target.nodeName !== 'LI' || target.children.length === 0) return;
    if (target.classList.contains('closed')) {
      target.classList.remove('closed');
      target.classList.add('open');
    } else {
      target.classList.remove('open');
      target.classList.add('closed');
    }
  }
}

customElements.define('expanding-list', ExpandingList, { extends: 'ul' });
