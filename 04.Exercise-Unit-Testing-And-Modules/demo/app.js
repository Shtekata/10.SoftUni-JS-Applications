const myVar = 3;

const result = myModule.addNumbers(myVar, myModule.getNumber());

console.log(myModule.people);

myModule.output('The result is ' + result + ' -> '+  myModule.people.join(' : '));