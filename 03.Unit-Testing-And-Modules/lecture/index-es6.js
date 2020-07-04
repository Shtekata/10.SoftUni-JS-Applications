import { add as libAdd, changeT } from './mod-es6';
const a = add(2, 3);

import * as lib from './mod-es6';
lib.add(5, 6);

import tt from './mod-es6';

console.log(a, tt, lib.add);

// const mod = (function () {
//   return {
//     add,
//     changeT,
//   };
// })();
