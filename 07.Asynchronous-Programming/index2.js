function doWorkAsync(time, success, data) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      if (success) {
        resolve(data);
        return;
      }
      reject(new Error(data));
    }, time);
  });
}

console.log('Start');

doWorkAsync(5000, true, [1, 2, 3])
  .then((x) => {
    return doWorkAsync(
      6000,
      true,
      x.map((x) => x + 1)
    );
  })
  .then((x) => console.log(x));

console.log('End');

doWorkAsync(5000, false, 'Bad Error!')
  .then((x) => {
    return doWorkAsync(
      6000,
      true,
      x.map((x) => x + 1)
    );
  })
  .catch((x) => Promise.reject(x))
  .then((x) => console.log(x))
  .catch((x) => console.error(x));

console.log('End');

Promise.all([
  doWorkAsync(5000, true, [1, 2, 3]),
  doWorkAsync(6000, true, [3, 4, 5]),
]).then((x) => console.log(x));
