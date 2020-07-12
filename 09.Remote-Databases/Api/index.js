(function () {
  const appContainerEl = document.querySelector('#app-container');
  const loginContainerEl = document.querySelector('#login-container');

  const registerBtn = document.querySelector('#register-btn');
  const loginBtn = document.querySelector('#login-btn');
  const emailInputEl = document.querySelector('#email');
  const passwordInputEl = document.querySelector('#password');
  const genericLoginErrorEl = document.querySelector('#generic-login-error');
  const appLoaderEl = document.querySelector('#app-loader');

  const userEmailEl = document.querySelector('#user-email');
  const logoutBtn = document.querySelector('#logout-btn');

  loginBtn.addEventListener('click', (x) => {
    genericLoginErrorEl.textContent = '';
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    if (!email || !password) {
      alert('Please provide credentials!');
      return;
    }

    toggleLoader();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(function () {
        toggleLoader();
      })
      .catch(function (error) {
        toggleLoader();
        genericLoginErrorEl.textContent = error.message;
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // ...
      });
  });

  function toggleLoader() {
    if (appLoaderEl.classList.contains('hidden')) {
      appLoaderEl.classList.remove('hidden');
      return;
    }
    appLoaderEl.classList.add('hidden');
  }

  logoutBtn.addEventListener('click', (x) => {
    x.preventDefault();
    firebase
      .auth()
      .signOut()
      .catch(function (error) {
        console.error(error);
      });
  });

  registerBtn.addEventListener('click', () => {
    genericLoginErrorEl.textContent = '';
    const email = emailInputEl.value;
    const password = passwordInputEl.value;
    if (!email || !password) {
      alert('Please provide credentials!');
      return;
    }

    toggleLoader();
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(function () {
        toggleLoader();
      })
      .catch(function (error) {
        toggleLoader();
        genericLoginErrorEl.textContent = error.message;
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // ...
      });
  });

  function init() {
    // console.log(firebase.app().name); // "[DEFAULT]"

    //   firebase
    //     .auth()
    //     .createUserWithEmailAndPassword(email, password)
    //     .catch(function (error) {
    //       // Handle Errors here.
    //       var errorCode = error.code;
    //       var errorMessage = error.message;
    //       // ...
    //     });

    firebase.auth().onAuthStateChanged(function (user) {
      //   console.log(user);
      if (user) {
        loginContainerEl.classList.add('hidden');
        appContainerEl.classList.remove('hidden');
        userEmailEl.textContent = user.email;
        // User is signed in.
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // ...
      } else {
        // User is signed out.
        // ...
        appContainerEl.classList.add('hidden');
        loginContainerEl.classList.remove('hidden');
      }
      appLoaderEl.classList.add('hidden');
    });
  }

  init();
})();
