function purchaseBook(bookDetails, discountPercent, taxPercent, amountPurchased, creditDuration) {
  let bookPurchased = 0;
  let totalPrice = 0;
  let priceAfterDiscount = 0;
  let priceAfterTax = 0;

  const creditPayments = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  console.log('Book Stock:', bookDetails.stock);
  if (bookDetails.stock < amountPurchased) {
    console.log('You can only buy', bookDetails.stock, 'books.');
  }

  if (bookDetails.stock > 0) {
    for (let i = 0; i < amountPurchased; i++) {
      if (bookDetails.stock === 0) {
        break;
      }
      bookDetails.stock--;
      bookPurchased++;
      totalPrice += bookDetails.price;
    }

    console.log('\nBook Purchased:', bookPurchased);
    console.log('Total Price: Rp', totalPrice);

    if (bookDetails.discount) {
      const discount = totalPrice * (discountPercent / 100);
      console.log('\nAmount of Discount: Rp', discount);

      priceAfterDiscount = totalPrice - discount;
      console.log('Total Price After Discount: Rp', priceAfterDiscount);

      const tax = totalPrice * (taxPercent / 100);
      console.log('\nAmount of Tax: Rp', tax);

      priceAfterTax = priceAfterDiscount + tax;
      console.log('Total Price After Tax: Rp', priceAfterTax);
    }

    let monthlyPrice = priceAfterTax / creditDuration;
    for (let i = 1; i <= creditDuration; i++) {
      let dueMonth = (currentMonth + i) % 12;
      let dueYear = currentYear + Math.floor((currentMonth + i) / 12);
      let dueDate = new Date(dueYear, dueMonth, currentDate.getDate());

      let monthPayment = {
        dueDate: dueDate.toDateString(),
        payments: monthlyPrice,
      };
      creditPayments.push(monthPayment);
    }

    console.log('\nDue Dates for Credit Payments:');
    for (let i = 0; i < creditPayments.length; i++) {
      console.log('Month ' + (i + 1) + ': ' + creditPayments[i]['DueDate'] + ', Payment: Rp ' + creditPayments[i]['Payments']);
    }

    console.log('\nBook Stock Remaining:', bookDetails.stock);
    if (bookDetails.stock > 0) {
      console.log('Yes, there are still' + bookDetails.stock + 'books in stock.\nCome on, you can still buy more books.\n');
    } else {
      console.log('You buy all available stock. \nCurrently the book is out of stock.');
    }
  } else {
    console.log('Oops, sorry. Stock is currently out of stock');
  }
}

let bookDetails = {
  title: 'Arah Langkah',
  author: 'Fiersa Besari',
  publisher: 'Media Kita',
  stock: 1,
  price: 80000,
  discount: true,
};

const discountPercent = 10;
let taxPercent = 11;
const amountPurchased = 2;
const creditDuration = 5;

purchaseBook(bookDetails, discountPercent, taxPercent, amountPurchased, creditDuration);
