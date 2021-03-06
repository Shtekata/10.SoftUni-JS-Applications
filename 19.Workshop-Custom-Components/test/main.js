import { html, render } from './node_modules/lit-html/lit-html.js';
import { repeat } from './node_modules/lit-html/directives/repeat.js';

// function tag(strings, ...exprs) {
//   console.log(strings, exprs);
// }
// tag`
// <div>${3 + 2}</div>
// `;

// : context.users.map((x) => html`<div>${x.email}</div>`)}

function withUpdate(klass, templateFn) {
  klass.prototype.hasUpdateScheduled = false;
  klass.prototype._update = function componentUpdate() {
    if (this.hasUpdateScheduled) {
      return;
    }
    Promise.resolve().then(() => {
      const template = templateFn(this);
      render(template, this.shadowRoot, { eventContext: this });
      this.hasUpdateScheduled = false;
    });
  };
  return klass;
}

// const getAppRootTemplate = (context) =>
//   html`
//     <button @click=${context.toggleDisabledHandler}>Toggle Disabled</button>
//     <input ?disabled=${context.isDisabled} value="${context.inputValue}" />
//     ${context.isLoading
//       ? html`<div>Loading...</div>`
//       : html`${repeat(
//           context.users,
//           (x) => x.id,
//           (y) => html`<div>${y.email}</div>`
//         )}`}
//   `;

const getAppRootTemplate = (context) => {
  const loader = html`<div>Loading...</div>`;
  const users = html`<user-list
    @select=${context.selectUserHandler}
    .users=${context.users || []}
  ></user-list>`;

  return html`
    <button @click=${context.toggleDisabledHandler}>Toggle Disabled</button>
    <input ?disabled=${context.isDisabled} value="${context.inputValue}" />
    ${context.isLoading ? loader : users}
  `;
};

// const getAppRootTemplate = (context) =>
//   html`
//     <button @click=${context.toggleDisabledHandler}>Toggle Disabled</button>
//     <input ?disabled=${context.isDisabled} value="${context.inputValue}" />
//     ${context.isLoading
//       ? html`<div>Loading...</div>`
//       : html`<user-list></user-list>`}
//   `;

class AppRoot extends HTMLElement {
  set inputValue(newValue) {
    this._inputValue = newValue;
    this._update();
  }

  get inputValue() {
    return this._inputValue || '';
  }

  set isLoading(newValue) {
    this._isLoading = newValue;
    this._update();
  }

  get isLoading() {
    return this._isLoading;
  }

  set users(newValue) {
    this._users = newValue;
    this._update();
  }

  get users() {
    return this._users;
  }

  set isDisabled(newValue) {
    this._isDisabled = newValue;
    this._update();
  }

  get isDisabled() {
    return this._isDisabled;
  }

  toggleDisabledHandler() {
    this.isDisabled = !this.isDisabled;
  }

  constructor() {
    super();
    // const root = this.attachShadow({ mode: 'closed' });
    this.attachShadow({ mode: 'open' });
    // this.hasUpdateScheduled = false;
    // this._update = componentUpdateFn;

    // setTimeout(function () {
    //   root
    //     .querySelector('#toggle-button')
    //     .addEventListener('click', console.log);
    // }, 0);

    this.isLoading = false;
    this.users = [];
  }

  selectUserHandler(x) {
    console.log(x);
    this.inputValue = x.detail.userId;
  }

  connectedCallback() {
    this.loadUsers().then((x) => {
      this.isLoading = false;
      this.users = x;
    });
  }

  loadUsers() {
    this.isLoading = true;
    return fetch('https://jsonplaceholder.typicode.com/users').then((x) =>
      x.json()
    );
  }
}

customElements.define('app-root', withUpdate(AppRoot, getAppRootTemplate));
/////////////////////////////////////////////////////////////////////////////////////////
const getUserListTemplate = (context) =>
  html`<ul @click=${context.selectUserHandler}>
    ${repeat(
      context.users,
      (x) => x.id,
      (x) =>
        html`<li class="user-email" data-id=${x.id} data-username=${x.username}>
          ${x.email}
        </li>`
    )}
  </ul>`;

class UsersList extends HTMLElement {
  set users(newValue) {
    this._users = newValue;
    this._update();
  }

  get users() {
    return this._users;
  }

  selectUserHandler(x) {
    const target = x.target;
    if (!target.classList.contains('user-email')) {
      return;
    }
    const userId = target.getAttribute('data-id');
    this.dispatchEvent(new CustomEvent('select', { detail: { userId } }));
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.users = [];
  }

  //   connectedCallback() {
  //     this.loadUsers().then((x) => {
  //       this.isLoading = false;
  //       this.users = x;
  //     });
  //   }

  //   loadUsers() {
  //     this.isLoading = true;
  //     return fetch('https://jsonplaceholder.typicode.com/users').then((x) =>
  //       x.json()
  //     );
  //   }
}

customElements.define('user-list', withUpdate(UsersList, getUserListTemplate));
