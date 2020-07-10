console.log('Hello');

function doWork() {
  setTimeout(() => {
    console.log('set time out finished');
  }, 2000);
}

doWork();

console.log('Hello again!');
