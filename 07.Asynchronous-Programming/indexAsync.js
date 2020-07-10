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

(async function () {
  try {
    let x;
    try {
      x = await doWorkAsync(5000, false, 'Bad Error');
      x = await doWorkAsync(
        6000,
        true,
        x.map((x) => x + 1)
      );
    //   const result = await Promise.all([]);
    } catch (err) {
      throw err;
    }
    console.log(x);
  } catch (err) {
    console.log(err);
  }
})();
