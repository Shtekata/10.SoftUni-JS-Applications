function loadRepos() {
  const el = document.querySelector('#res');
  const url = 'https://api.github.com/users/testnakov/repos';

  //   const xmlHttpRequest = new XMLHttpRequest();
  //   xmlHttpRequest.addEventListener('readystatechange', () => {
  //     if (xmlHttpRequest.readyState === 4) {
  //       if (xmlHttpRequest.status === 200) {
  //         el.innerHTML = xmlHttpRequest.responseText;
  //       } else if (xmlHttpRequest.status === 401) {
  //         console.warn('Unauthorized');
  //       } else if (xmlHttpRequest.status == 500) {
  //         console.error('Server Error');
  //       }
  //     }
  //   });
  //   xmlHttpRequest.open('GET', url);
  //   xmlHttpRequest.send();

  fetch(url)
    .then((x) => {
      if (x.status === 200) {
        return x.json();
      } else if (x.status === 401) {
        console.warn('UNAUTHORIZED');
      } else if (x.status === 500) {
        console.error('Server Error');
      }
    })
    .then((x) => {
      if (!x) {
        return;
      }
       el.textContent = JSON.stringify(x);
    });
}
