const reposEl = document.querySelector('#repos');
const usernameEl = document.querySelector('#username');

function loadRepos() {
  const username = usernameEl.value;
  const children = reposEl.children;
  if (children.length > 0) {
    [...children].forEach((x) => x.remove());
  }
  const loading = document.createElement('h1');
  loading.textContent = 'Loading...';
  reposEl.appendChild(loading);
  const url = `https://api.github.com/users/${username}/repos`;
  fetch(url)
    .then((x) => x.json())
    .then((x) => {
      x.forEach((x) => {
        loading.remove();
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = x.html_url;
        a.textContent = x.full_name;
        li.appendChild(a);
        reposEl.appendChild(li);
      });
    });
}
