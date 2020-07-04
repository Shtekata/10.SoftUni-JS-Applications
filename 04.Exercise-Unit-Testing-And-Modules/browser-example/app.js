import * as myModule from './module.js';
import people from './data.js';

const myVar = 3;

const result = myModule.addNumbers(myVar, myModule.getNumber());

console.log(people);

myModule.output(
  'The result is ' + result + ' -> ' + people.join(' : ')
);

if (result !== 8) {
  console.error('result is not 8');
} else {
  console.info('pass');
}
