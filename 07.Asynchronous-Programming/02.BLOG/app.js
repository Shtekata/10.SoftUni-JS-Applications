const BASE_URL = 'https://blog-apps-c12bf.firebaseio.com';

const loadPostBtn = document.querySelector('#btnLoadPosts');
const postSelectEl = document.querySelector('#posts');
const viewPostBtn = document.querySelector('#btnViewPost');
const postTiitleEl = document.querySelector('#post-title');
const postBodyEl = document.querySelector('#post-body');
const postCommentUlEl = document.querySelector('#post-comments');

function ffetch(url, options) {
  options = options || {};
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status === 200) {
          //   resolve(JSON.parse(request.responseText));
          resolve({ json: () => JSON.parse(request.responseText) });
          return;
        }
        reject(new Error(request.status));
      }
    };
    request.open(options.method || 'GET', url);
    request.send(options.body);
  });
}

function loadPosts() {
  postSelectEl.removeAttribute('disabled');
  //   ffetch(`${BASE_URL}/posts.json`);
  fetch(`${BASE_URL}/posts.json`)
    .then((x) => x.json())
    .then((x) =>
      Object.entries(x).forEach(([key, value]) => {
        const o = document.createElement('option');
        o.value = key;
        o.textContent = value.title;
        postSelectEl.appendChild(o);
      })
    );
}

function loadPostComments() {
  const postId = postSelectEl.value;
  const commentsReq = ffetch(`${BASE_URL}/comments.json`).then((x) => x.json());
  const postReq = ffetch(`${BASE_URL}/posts/${postId}.json`).then((x) =>
    x.json()
  );
  Promise.all([commentsReq, postReq]).then(([comments, curentPost]) => {
    // const allPostComments = Object.entries(comments).reduce(
    //   (x, [key, value]) => {
    //     if (
    //       !Object.keys(curentPost.comments || {})
    //         .map((x) => x.postId)
    //         .includes(postId)
    //     ) {
    //       return x;
    //     }
    //     return x.concat(value);
    //   },
    //   []
    // );
    postTiitleEl.textContent = curentPost.title;
    postBodyEl.textContent = curentPost.body;

    postCommentUlEl.innerHTML = '';
    Object.entries(curentPost.comments || {}).forEach(([key, value]) => {
      const li = document.createElement('li');
      li.textContent = value.text;
      postCommentUlEl.appendChild(li);
    });
  });
}

function attachEvents() {
  postSelectEl.innerHTML = '<option value="">Select post...</option>';
  postSelectEl.setAttribute('disabled', '');
  loadPostBtn.addEventListener('click', loadPosts);
  //   postSelectEl.addEventListener('change', selectPostHandler);
  viewPostBtn.addEventListener('click', loadPostComments);
}

attachEvents();
