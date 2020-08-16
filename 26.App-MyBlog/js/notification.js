const element = document.querySelector('#infoBox');

element.addEventListener('click', hideElement);

function hideElement() {
  element.textContent = '';
  element.classList.remove('notificationSuccess');
  element.classList.remove('notificationError');
}

export function showInfo(message) {
  element.textContent = message;
  element.classList.add('notificationSuccess');
  setTimeout(hideElement, 5000);
}
export function showError(message) {
  element.textContent = message;
  element.classList.add('notificationError');
  setTimeout(hideElement, 5000);
}

let request = 0;
let beforeState = false;
let textContent = '';
export function beginRequest() {
  request++;
  if (element.classList.contains('notificationSuccess')) {
    beforeState = true;
    textContent = element.textContent;
  } 
  element.textContent = 'Loading...';
  element.classList.add('notificationLoading');
}
export function endRequest() {
  request--;
  if (request === 0) {
    element.classList.remove('notificationLoading');
    if (beforeState) {
      showInfo(textContent);
    } else {
      element.textContent = '';
    }
  }
}
