let t = 100;

module.exports.add = (x, y) => {
  return t + x + y;
};

module.exports.changeT = (newValue) => {
  t = newValue;
};

// module.exports = () => {
//   return {

//   };
// };
