const express = require('express');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());

function auth(req, res, next) {
  const user = basicAuth(req);
  if (user && user.name === 'admin' && user.pass === 'password') {
    return next();
  } else {
    return res.json('Access Denied.');
  }
}

let availableBooks = [];
let purchaseDetails = {};

// let listBooks = [
//   { title: 'Arah Langkah', author: 'Fiersa Besari', publisher: 'Media Kita', stock: 7, price: 80000, discount: true, discountPercent: 10 },
//   { title: 'Tapak Jejak', author: 'Fiersa Besari', publisher: 'Media Kita', stock: 5, price: 85000, discount: false, discountPercent: 10 },
//   { title: 'Alkena', author: 'Wira Setianegara', publisher: 'Media Kita', stock: 3, price: 55000, discount: false, discountPercent: 10 },
//   { title: 'Inersia', author: 'Wira Setianegara', publisher: 'Media Kita', stock: 5, price: 50000, discount: false, discountPercent: 10 },
// ];

// let purchaseDetails = {
//   discount: false,
//   discountPercent: 10,
//   taxPercent: 1,
//   booksPurchased: [],
//   credit: false,
//   creditDuration: 0,
//   creditDuration: 0,
// };

function displayBooks(listBooks) {
  listBooks.forEach((book) => {
    if (book.stock > 0) {
      availableBooks.push(book);
    }
  });
}

function findBook(bookTitle) {
  return availableBooks.reduce((foundBook, book) => {
    return book.title === bookTitle ? book : foundBook;
  }, false);
}

function addBook(bookTitle, bookAmount) {
  console.log(bookTitle);
  const book = findBook(bookTitle);
  console.log(book);
  if (book) {
    book.amount = bookAmount;
    purchaseDetails.booksPurchased.push(book);
  }
}

function addCreditDuration(creditDuration) {
  purchaseDetails.creditDuration = creditDuration;
  if (purchaseDetails.creditDuration > 0) {
    purchaseDetails.credit = true;
  }
}

function calcPurchase() {
  totalPrice = 0;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  for (book of purchaseDetails.booksPurchased) {
    bookPurchased = 0;
    totalBookPrice = 0;
    // hitung per buku
    if (book.stock > 0) {
      console.log(book.title, ' Stock: ', book.stock);
      for (let i = 0; i < book.amount; i++) {
        if (book.stock === 0) {
          break;
        }
        book.stock--;
        bookPurchased++;
        totalBookPrice += book.price;
      }
      book.bookPurchased = bookPurchased;
      console.log('Book ', book.title, ' Purchased: ', bookPurchased);

      if (book.discount) {
        const bookDiscount = totalBookPrice * (book.discountPercent / 100);
        console.log('Book ', book.title, ' Discount: ', bookDiscount);
        totalBookPrice -= bookDiscount;
      }
      book.totalBookPrice = totalBookPrice;
      console.log('Book ', book.title, ' Price: ', totalBookPrice);
    }

    const indexBook = availableBooks.findIndex((element) => element.title === book.title);
    availableBooks[indexBook].stock = book.stock;
    console.log('Book ', book.title, ' Remaining Stock: ', availableBooks[indexBook].stock);
    console.log('--------------------------------------------');
    totalPrice += totalBookPrice;
    console.log('--------------------------------------------');
  }

  console.log('Total Price:', totalPrice);
  if (purchaseDetails.discount) {
    const discount = totalPrice * (purchaseDetails.discountPercent / 100);
    console.log('Payments Discount: ', discount);
    totalPrice -= discount;
  }

  console.log('Total Price:', totalPrice);
  const tax = totalPrice * (purchaseDetails.taxPercent / 100);
  console.log('Payments Tax: ', tax);
  totalPrice += tax;
  //   purchaseDetails.totalPrice = totalPrice; // ini
  console.log('Total Price:', totalPrice);
  console.log('--------------------------------------------');

  if (purchaseDetails.credit) {
    let creditPayments = [];
    let monthPayment = {};
    let monthlyPrice = Math.round(totalPrice / purchaseDetails.creditDuration);
    for (let i = 1; i <= purchaseDetails.creditDuration; i++) {
      let dueMonth = (currentMonth + i) % 12;
      let dueYear = currentYear + Math.floor((currentMonth + i) / 12);
      let dueDate = new Date(dueYear, dueMonth, currentDate.getDate());

      if (i === purchaseDetails.creditDuration) {
        monthlyPrice = totalPrice - monthlyPrice * (i - 1);
        monthPayment = {
          dueDate: dueDate.toDateString(),
          payments: monthlyPrice,
        };
      } else {
        monthPayment = {
          dueDate: dueDate.toDateString(),
          payments: monthlyPrice,
        };
      }
      creditPayments.push(monthPayment);
    }
    purchaseDetails.creditPayments = creditPayments;
    console.log('Due Dates for Credit Payments:');
    purchaseDetails.creditPayments.forEach((monthly) => console.log('Date: ', monthly.dueDate + ', Payment: Rp ' + monthly.payments));
  }
}

app.get('/', auth, (req, res) => {
  const input = req.body;
  displayBooks(input.listBooks);
  purchaseDetails = input.purchaseDetails;
  res.json({ availableBooks, purchaseDetails });
});

app.post('/purchase', auth, (req, res) => {
  const { books, creditDuration } = req.body;
  books.forEach((book) => addBook(book.bookTitle, book.bookAmount));
  addCreditDuration(creditDuration);
  res.json(purchaseDetails);
});

app.post('/calculate', auth, (req, res) => {
  calcPurchase();
  res.json({ availableBooks, purchaseDetails });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
