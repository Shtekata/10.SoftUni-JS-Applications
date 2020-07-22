(function () {
  const templates = {};
  const loadingBoxEl = document.querySelector('#loadingBox');
  const infoBoxEl = document.querySelector('#infoBox');
  const errorBoxEl = document.querySelector('#errorBox');

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyDxtZvL2NdH7qa_ubrEU-fgXpwfPrUH75k',
    authDomain: 'furniture-c2c74.firebaseapp.com',
    databaseURL: 'https://furniture-c2c74.firebaseio.com',
    projectId: 'furniture-c2c74',
    storageBucket: 'furniture-c2c74.appspot.com',
    messagingSenderId: '505704327166',
    appId: '1:505704327166:web:337a5b7529fdd90a54c2af',
    measurementId: 'G-G46MHMRRGE',
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  function toggleLoader(showloader) {
    if (showloader) {
      loadingBoxEl.style.display = 'inline';
      return;
    }
    loadingBoxEl.style.display = 'none';
  }

  function getTemplate(templatePath) {
    const existingTemplate = templates[templatePath];
    if (existingTemplate) return Promise.resolve(existingTemplate);
    return fetch(`/templates/${templatePath}.hbs`)
      .then((x) => x.text())
      .then((x) => {
        const template = Handlebars.compile(x);
        templates[templatePath] = template;
        return template;
      });
  }

  function renderTemplate(templatePath, templateContex, swapFn) {
    // getTemplate(templatePath).then((x) => swapFn(x(templateContex)));
    return getTemplate(templatePath).then((x) => {
        const content = x( templateContex );
      swapFn(content);
    });
  }

  function loadRegisterPartialTemplate(templatePath, templateName) {
    return fetch(`/templates/partials/${templatePath}.hbs`)
      .then((x) => x.text())
      .then((x) => {
        Handlebars.registerPartial(templateName, x);
        return x;
      });
  }

  function loadFurniture() {
    return fetch(`${firebaseConfig.databaseURL}/furniture.json`)
      .then((x) => x.json())
      .then((x) => {
        return Object.keys(x).reduce((z, y) => {
          const currentItem = x[y];
          return z.concat({ id: y, ...currentItem });
        }, []);
      });
  }

  function loadFurnitureWithId(id) {
    return fetch(
      `${firebaseConfig.databaseURL}/furniture/${id}.json`
    ).then((x) => x.json());
  }

  function onCreateFurnitureLoaded(createHandlerFn) {
    const createBtn = document.querySelector('#create-btn');
    createBtn.addEventListener('click', createHandlerFn);
  }

  const app = Sammy('#container', function () {
    this.before({}, function () {
      toggleLoader(true);
    });

    this.get('#/', function () {
      //   getTemplate('home');
      //   console.log('HOME!');
      //   this.swap('HOMEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
      Promise.all([
        loadFurniture(),
        loadRegisterPartialTemplate('furniture-item', 'furnitureItem'),
      ])
        .then(([items]) =>
          renderTemplate('home', { items }, this.swap.bind(this))
        )
        .then(() => {
          toggleLoader(false);
        });
    });

    this.get('#/profile', function () {
      //   console.log('ABOUT!');
      //   this.swap('ABOUTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
      renderTemplate('profile', {}, this.swap.bind(this)).then(() => {
        toggleLoader(false);
      });
    });

    this.get('#/create-furniture', function () {
      renderTemplate('create-furniture', {}, this.swap.bind(this)).then(() => {
        toggleLoader(false);
        const onCreateHandler = () => {
          const newMakeEl = document.querySelector('#new-make');
          const newModelEl = document.querySelector('#new-model');
          const newYearEl = document.querySelector('#new-year');
          const newDescriptionEl = document.querySelector('#new-description');
          const newPriceEl = document.querySelector('#new-price');
          const newImageEl = document.querySelector('#new-image');
          const newMaterialEl = document.querySelector('#new-material');

          const inputs = [
            newMakeEl,
            newModelEl,
            newYearEl,
            newDescriptionEl,
            newPriceEl,
            newImageEl,
            newMaterialEl,
          ];

          const values = inputs.map((x) => x.value);
          const missingInputValue = values.findIndex((x) => !x);
          if (missingInputValue !== -1) {
            console.error('MISSING DATA', inputs[missingInputValue]);
            return;
          }

          const body = values.reduce((x, y, i) => {
            const currentInputEl = inputs[i];
            x[currentInputEl.name] = y;
            return x;
          }, {});

          const url = `${firebaseConfig.databaseURL}/furniture.json`;

          fetch(url, { method: 'POST', body: JSON.stringify(body) }).then(
            () => {
              this.redirect('#/');
            }
          );
        };
        onCreateFurnitureLoaded(onCreateHandler);
      });
    });

    this.get('#/furniture-detail/:id', function (context) {
      const id = context.params.id;
      loadFurnitureWithId(id)
        .then((furniture) =>
          renderTemplate(
            'furniture-detail',
            { furniture },
            this.swap.bind(this)
          )
        )
        .then(() => {
          toggleLoader(false);
        });
    });
  });

  app.run('#/');
})();
