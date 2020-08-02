import { html, render } from 'lit-html';
import * as axios from 'axios';
import * as appText from './app-text.txt';
import * as utils from './utils';
import { GlobalLoader } from './global/global-loader';

const appTemplate = (x) =>
  html`
    <style>
      ${require('./app.css')}
    </style>
    <div>${x.appText}</div>
    <button @click=${x.btnClickHandler}>CLICK ME!</button>
    <div>${require('./app-text2.txt')}</div>
  `;

class AppRoot extends HTMLElement {
  appText = appText;

  btnClickHandler = () => {
    console.log(this);
  };

  constructor() {
    super();

    // this.appText = appText;

    const root = this.attachShadow({ mode: 'closed' });
    this._update = () => {
      const templateResult = appTemplate(this);
      //   render(templateResult, root, { eventContext: this });
      render(templateResult, root);
    };
    this._update();

    const a = null;
    const b = a?.test;
    console.log(b);
  }

  connectedCallback() {
    console.log(utils.intToBool(0));
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((x) => console.log(x));
  }
}

customElements.define('app-root', AppRoot);
