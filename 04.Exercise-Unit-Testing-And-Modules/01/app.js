function addNumbers(x, y) {
  return x + y;
}

function getNumber() {
  return 5;
}

function output(text) {
  document.querySelector('#output').textContent = text;
}

module.exports = {
  addNumbers,
  getNumber,
};
