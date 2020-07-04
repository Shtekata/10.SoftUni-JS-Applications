console.log('Module initialized');

export function addNumbers(x, y) {
  return x + y;
}

export function getNumber() {
  return 5;
}

export function output(text) {
  document.querySelector('#output').textContent = text;
}

function notGlobalFunc() {
    //...
}