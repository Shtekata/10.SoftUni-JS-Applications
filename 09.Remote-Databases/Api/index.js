(function () {
  const appEl = document.querySelector('#app');
  const loaderTemplateScriptEl = document.querySelector('#loader-template');

  //   function toggleLoader() {
  //     if (appLoaderEl.classList.contains('hidden')) {
  //       appLoaderEl.classList.remove('hidden');
  //       return;
  //     }
  //     appLoaderEl.classList.add('hidden');
  //   }

  function afterLoginRegisterRenderFactory({
    loginRegisterTemplate,
    loaderTemplate,
  }) {
    return function afterLoginRegisterRender() {
      const registerBtn = document.querySelector('#register-btn');
      const loginBtn = document.querySelector('#login-btn');
      const emailInputEl = document.querySelector('#email');
      const passwordInputEl = document.querySelector('#password');

      loginBtn.addEventListener('click', (x) => {
        //   genericLoginErrorEl.textContent = '';
        const email = emailInputEl.value;
        const password = passwordInputEl.value;
        if (!email || !password) {
          alert('Please provide credentials!');
          return;
        }

        //   toggleLoader();
        render(loaderTemplate);
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          // .then(function () {
          //   render(loaderTemplate);
          // })
          .catch(function (error) {
            //   toggleLoader();
            //   genericLoginErrorEl.textContent = error.message;
            render(
              loginRegisterTemplate,
              { error: error.message, email, password },
              afterLoginRegisterRender
            );
          });
      });

      registerBtn.addEventListener('click', () => {
        //   genericLoginErrorEl.textContent = '';
        const email = emailInputEl.value;
        const password = passwordInputEl.value;
        if (!email || !password) {
          alert('Please provide credentials!');
          return;
        }

        //   toggleLoader();
        render(loaderTemplate);
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          // .then(function () {
          //   render(loaderTemplate);
          // })
          .catch(function (error) {
            //   toggleLoader();
            //   genericLoginErrorEl.textContent = error.message;
            render(
              loginRegisterTemplate,
              { error: error.message, email, password },
              afterLoginRegisterRender
            );
          });
      });
    };
  }

  function afterAuthContentRenderFactory() {
    return function afterAuthContentRender() {
      const logoutBtn = document.querySelector('#logout-btn');
      logoutBtn.addEventListener('click', (x) => {
        x.preventDefault();
        firebase
          .auth()
          .signOut()
          .catch(function (error) {
            console.error(error);
          });
      });
    };
  }

  function render(template, data, ...cbs) {
    appEl.innerHTML = template(data);
    cbs.forEach((x) => x());
  }

  function init() {
    const generateTemplate = (x) => Handlebars.compile(x);
    const loaderTemplate = generateTemplate(loaderTemplateScriptEl.innerHTML);
    render(loaderTemplate);

    Promise.all([
      fetch('./templates/auth-content.hbs').then((x) => x.text()),
      //   fetch('./templates/loader.hbs').then((x) => x.text()),
      fetch('./templates/login-register-form.hbs').then((x) => x.text()),
    ])
      .then((x) => x.map(generateTemplate))
      // .then([authContentTemplate, loaderTemplate, loginRegisterTemplate]) => {
      .then(([authContentTemplate, loginRegisterTemplate]) => {
        firebase.auth().onAuthStateChanged(function (user) {
          if (user) {
            render(
              authContentTemplate,
              { email: user.email },
              afterAuthContentRenderFactory()
            );
          } else {
            render(
              loginRegisterTemplate,
              {},
              afterLoginRegisterRenderFactory({
                authContentTemplate,
                loginRegisterTemplate,
                loaderTemplate,
              })
            );
          }
        });
      });
  }

  init();
})();
