function purchaseBook(bookDetails, discountPercent, taxPercent, amountPurchased) {
  let bookPurchased = 0;
  let totalPrice = 0;

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
    console.log('Total Price:', totalPrice);

    if (bookDetails.discount) {
      const discount = totalPrice * (discountPercent / 100);
      console.log('\nAmount of Discount:', discount);

      let priceAfterDiscount = totalPrice - discount;
      console.log('Total Price After Discount:', priceAfterDiscount);

      const tax = totalPrice * (taxPercent / 100);
      console.log('\nAmount of Tax:', tax);

      let priceAfterTax = priceAfterDiscount + tax;
      console.log('Total Price After Tax:', priceAfterTax);
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
let amountPurchased = 2;

purchaseBook(bookDetails, discountPercent, taxPercent, amountPurchased);
