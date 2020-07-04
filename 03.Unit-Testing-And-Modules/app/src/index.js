module.exports.sum = function (arr) {
  if (!Array.isArray(arr)) { return NaN;}
  return arr.reduce((x, y) => x + +y, 0);
};
