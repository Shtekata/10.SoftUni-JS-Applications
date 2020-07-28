import {
  //   pathToRegexp,
  match,
} from './node_modules/path-to-regexp/dist.es2015/index.js';

function Sammy(selector, initFn) {
  const mainEl = document.querySelector(selector);
  const getPathCollection = [];
  const postPathCollection = [];
  let currentPath;

  function onAnchorClickHandler(x) {
    x.preventDefault();
    const target = x.target;
    const path = target.getAttribute('href');
    core.redirect(path);
    window.history.pushState(null, '', path);
  }

  function setupFormSubmissionHandlers(cb) {
    Array.from(document.querySelectorAll('form')).forEach((x) => {
      if (x.hasAttribute('data-has-handler')) {
        return;
      }
      x.addEventListener('submit', cb);
      x.setAttribute('data-has-handler', true);
    });
  }

  function setupAnchorHandlers() {
    // Array.from(document.querySelectorAll('a:not(.has-handler)')).forEach((x) => {
    Array.from(document.querySelectorAll('a')).forEach((x) => {
      if (x.hasAttribute('data-has-handler')) {
        return;
      }
      x.addEventListener('click', onAnchorClickHandler);
      x.setAttribute('data-has-handler', true);
    });
  }

  function setupListeners() {
    setupAnchorHandlers();
    window.addEventListener('popstate', function (x) {
      core.redirect(window.location.pathname);
    });
  }

  const core = {
    get(path, fn) {
      //   const re = pathToRegexp(path);
      //   getPathCollection.push({ path, fn, re });
      const matchFn = match(path, { decode: decodeURIComponent });
      getPathCollection.push({ path, fn, matchFn });
    },
    post(path, fn) {
      const matchFn = match(path, { decode: decodeURIComponent });
      postPathCollection.push({ path, fn, matchFn });
    },
    load(url) {
      return fetch(url).then((x) => {
        return x.json();
      });
    },
    redirect(path) {
      currentPath = path;
      let params;
      const pathObj = getPathCollection.find((x) => {
        // const data = x.re.exec(currentPath);
        const data = x.matchFn(currentPath);
        if (data) params = data.params;
        return !!data;
      });
      if (!pathObj) {
        console.error(`body 404 Not Found get ${currentPath}`);
        return;
      }
      pathObj.fn.call(core, { params });
    },
    swap(htmlContent) {
      mainEl.innerHTML = htmlContent;
      //   setupAnchorHandlers();
      setTimeout(setupAnchorHandlers, 0);
      setTimeout(
        () => setupFormSubmissionHandlers(this._formSubmissionHandle),
        0
      );
    },
    // render() {

    // },
    _formSubmissionHandle(e) {
      e.preventDefault();
      const target = e.target;
      if (target.method.toLowerCase() !== 'post') {
        return;
      }
      let params;
      const pathObj = postPathCollection.find((x) => {
        const path = target.action.replace(
          location.protocol + '//' + location.host,
          ''
        );
        const data = x.matchFn(path);
        if (data) params = data.params;
        return !!data;
      });
      if (!pathObj) {
        console.error(`body 404 Not Found post ${target.action}`);
        return;
      }
      pathObj.fn.call(core, { params, form: target });
    },
  };

  const app = {
    run(path) {
      setupListeners();
      initFn.call(core);
      core.redirect(path);
    },
  };

  return app;
}

const app = Sammy('#main', function () {
  this.get('/', function () {
    // this.swap('<h1>HOME PAGE</h1>');
    // console.log('HELLO!');
    const ul = document.createElement('ul');
    this.load(`https://jsonplaceholder.typicode.com/users`).then((x) => {
      x.forEach((y) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        // a.href = `https://jsonplaceholder.typicode.com/users/${y.id}`;
        a.href = `/user/${y.id}`;
        a.textContent = y.email;
        li.appendChild(a);
        ul.appendChild(li);
      });
      const homePage = `${ul.outerHTML} <form method="post" action="/test"><input name="name" value=""/><button>Save</button></form>`;
      this.swap(homePage);
    });
  });

  this.get('/about', function () {
    this.swap('<h1>ABOUT PAGE</h1>');
  });

  this.get('/user/:id', function (context) {
    // console.log(context);
    this.swap('<div>Loading...</div>');
    this.load(
      `https://jsonplaceholder.typicode.com/users/${context.params.id}`
    ).then((x) => this.swap(`<h1>${x.email}</h1>`));
  });

  this.post('/test', function (context) {
    console.log(context.form.querySelector('input').value);
  });
});
app.run(location.pathname);
