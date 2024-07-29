function purchaseBook(bookDetails, discountPercent, taxPercent) {
  if (bookDetails.discount) {
    const discount = bookDetails.price * (discountPercent / 100);
    console.log('Amount of Discount: ', discount);

    let priceAfterDiscount = bookDetails.price - discount;
    console.log('Total Price After Discount: ', priceAfterDiscount);

    const tax = bookDetails.price * (taxPercent / 100);
    console.log('\nAmount of Tax: ', tax);

    let priceAfterTax = priceAfterDiscount + tax;
    console.log('Total Price After Tax: ', priceAfterTax);
  }
}

let bookDetails = {
  title: 'Arah Langkah',
  author: 'Fiersa Besari',
  publisher: 'Media Kita',
  price: 80000,
  discount: true,
};

const discountPercent = 10;
let taxPercent = 11;

purchaseBook(bookDetails, discountPercent, taxPercent);
