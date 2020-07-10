const usernameEl = document.querySelector('#username');
const repoEl = document.querySelector('#repo');
const commits = document.querySelector('#commits');

function getUrl(username, repo) {
  return `https://api.github.com/repos/${username}/${repo}/commits`;
}

function loadCommits() {
  commits.innerHTML = '';
  const url = getUrl(usernameEl.value, repoEl.value);
  fetch(url)
    .then((x) => x.json())
    .then((x) => {
      if (x.message !== 'Not Found') {
        [...x].forEach((x) => {
          const li = document.createElement('li');
          li.textContent = `${x.commit.author.name}: ${x.commit.message}`;
          commits.appendChild(li);
        });
      } else {
        return Promise.reject(x);
      }
    })
    .catch((x) => {
      const li = document.createElement('li');
      li.textContent = `Error: 404 (${x.message})`;
      commits.appendChild(li);
    });
}
