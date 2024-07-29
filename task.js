// declaration of two variables
let favBook1 = 'Distilasi Alkena';
const favBook2 = 'Arah Langkah';

console.log('First Book: ', favBook1);
console.log('Second Book: ', favBook2);

// update the first variable
favBook1 = 'Tapak Jejak';

// update the second variable (error)
// favBook2 = 'Catatan Juang';

console.log('\nFirst Book: ', favBook1);
console.log('Second Book: ', favBook2, '\n');

// concat both variables
let concatString = favBook1.concat(' is a continuation of ', favBook2);
console.log(concatString);

// other variables
let name = 'asep';
let role = 'talent';
let age = 29;
let isMarried = true;
let children = null;
let employeeInfo = new Map();
employeeInfo.set('name', 'asep');
employeeInfo.set('role', 'talent');
employeeInfo.set('age', 29);
employeeInfo.set('isMarried', true);
employeeInfo.set('children', null);
