// declaration of two variables
let favBook1 = 'Distilasi Alkena';
const favBook2 = 'Arah Langkah';

// update the first variable
if (favBook1 == favBook2) {
  console.log(true);
} else {
  console.log(false);
}

// declaration of two variables
let favBook1Price = 49500;
let favBook2Price = 79200;

// compare the variables which one have the highest price
if (favBook1Price > favBook2Price) {
  console.log(favBook1 + ' is more expensive than ' + favBook2);
} else if (favBook1Price < favBook2Price) {
  console.log(favBook2 + ' is more expensive than ' + favBook1);
} else {
  console.log(favBook1 + ' and ' + favBook2 + ' have the same price.');
}

// find the average price from those 2 variables
let avgPrice = (favBook1Price + favBook2Price) / 2;
console.log('Average Price: Rp ', avgPrice);

// determine the value of variable using ternary operator
let valueVar = avgPrice > 500000 ? 'Expensive' : 'Cheap';
console.log('Value: ', valueVar);
