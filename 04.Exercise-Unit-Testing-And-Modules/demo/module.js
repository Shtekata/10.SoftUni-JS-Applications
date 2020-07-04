(function () {
  console.log('Module initialized');

  function addNumbers(x, y) {
    return x + y;
  }

  function getNumber() {
    return 5;
  }

  function output(text) {
    document.querySelector('#output').textContent = text;
  }

  //   window.myModule = {
  //     addNumbers,
  //     getNumber,
  //     output,
  //   };

  window.myModule = window.myModule || {};
  window.myModule.addNumbers = addNumbers;
  window.myModule.getNumber = getNumber;
  window.myModule.output = output;
})(window);
