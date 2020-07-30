const appRootTemplate = document.createElement('template');
appRootTemplate.innerHTML = '<h1>HELLO FROM WEB COMPONENT</h1>';

class AppRoot extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'closed' });
    // const h1 = document.createElement('h1');
    // h1.textContent = 'HELLO FROM WEB COMPONENT!';
    // root.appendChild(h1);
    root.appendChild(appRootTemplate.content.cloneNode(true));
    root.addEventListener('click', console.log);
    // console.log('AppRoot constructed!');
  }
}

customElements.define('app-root', AppRoot);
