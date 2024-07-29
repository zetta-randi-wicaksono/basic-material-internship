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

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

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
// };

const asyncFunction = () => {
  return new Promise((resolve) => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        console.log('Iteration', i + 1);
        if (i === 4) {
          resolve('Asynchronous process completed.');
        }
      }, i * 2000);
    }
  });
};

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
    const purchasedBook = { ...book };
    purchasedBook.amount = bookAmount;
    purchaseDetails.booksPurchased.push(purchasedBook);
  }
}

function addCreditDuration(creditDuration) {
  purchaseDetails.creditDuration = creditDuration;
  if (purchaseDetails.creditDuration > 0) {
    purchaseDetails.credit = true;
  }
}

function calcCreditPayment(totalPrice) {
  const termAmount = new Set();
  let creditPayments = [];
  let monthPayment = {};
  let monthlyPrice = Math.round(totalPrice / purchaseDetails.creditDuration);

  for (let i = 1; i <= purchaseDetails.creditDuration; i++) {
    let dueMonth = (currentMonth + i) % 12;
    let dueYear = currentYear + Math.floor((currentMonth + i) / 12);
    let dueDate = new Date(dueYear, dueMonth, currentDate.getDate());

    if (i === purchaseDetails.creditDuration) {
      monthlyPrice = totalPrice - monthlyPrice * (i - 1);
    }
    monthPayment = {
      dueDate: dueDate.toDateString(),
      payments: monthlyPrice,
      paid: false,
    };
    termAmount.add(monthlyPrice);
    creditPayments.push(monthPayment);
  }
  return { creditPayments, termAmount };
}

const calcPurchase = async () => {
  let totalPrice = 0;
  let paymentMap = new Map();
  let specificTerm = '';
  let distinctList = [];
  let creditPaymentsMap = {};

  for (book of purchaseDetails.booksPurchased) {
    let bookPurchased = 0;
    let totalBookPrice = 0;
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
        book.amountDiscount = bookDiscount;
        console.log('Book ', book.title, ' Discount: ', bookDiscount);
        totalBookPrice -= bookDiscount;
      }
      book.totalBookPrice = totalBookPrice;
      console.log('Book ', book.title, ' Price: ', totalBookPrice);
    }

    const indexBook = availableBooks.findIndex((element) => element.title === book.title);
    availableBooks[indexBook].stock = book.stock;
    console.log('Book ', book.title, ' Remaining Stock: ', availableBooks[indexBook].stock);

    totalPrice += totalBookPrice;
    console.log('--------------------------------------------');
  }

  console.log('Total Price:', totalPrice);
  if (purchaseDetails.discount) {
    const discount = totalPrice * (purchaseDetails.discountPercent / 100);
    purchaseDetails.amountDiscount = discount;
    console.log('Payments Discount: ', discount);
    totalPrice -= discount;
  }

  console.log('Total Price:', totalPrice);
  const tax = totalPrice * (purchaseDetails.taxPercent / 100);
  purchaseDetails.amountTax = tax;
  console.log('Payments Tax: ', tax);
  totalPrice += tax;
  purchaseDetails.totalPrice = totalPrice; // ini
  console.log('Total Price:', totalPrice);
  console.log('--------------------------------------------');

  if (purchaseDetails.credit) {
    const { creditPayments, termAmount } = await calcCreditPayment(totalPrice);
    purchaseDetails.creditPayments = creditPayments;

    creditPayments.forEach((payment) => {
      paymentMap.set(payment.dueDate, payment);
    });

    console.log('Distinct List Term Amount:', termAmount);
    distinctList = Array.from(termAmount);

    console.log('Due Dates for Credit Payments:', paymentMap);
    paymentMap.forEach((value, key) => {
      creditPaymentsMap[key] = value;
    });

    const specificDate = new Date(currentYear, currentMonth + 2, currentDate.getDate()).toDateString();
    specificTerm = paymentMap.get(specificDate);

    console.log('Object of One Term Based on Certain Date: ', specificTerm);
  }
  return { availableBooks, purchaseDetails, distinctList, creditPaymentsMap, specificTerm };
};


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
  res.json({ availableBooks, purchaseDetails });
});

app.post('/calculate', auth, async (req, res) => {
  const result = await calcPurchase();
  res.send(result);
});

app.get('/endpoint1', auth, async (req, res) => {
  console.log('Endpoint 1 called');
  const result = await asyncFunction();
  console.log(result);
  res.json({ message: 'Endpoint 1 response' });
});

app.get('/endpoint2', auth, (req, res) => {
  console.log('Endpoint 2 called');
  const result = asyncFunction();
  console.log(result);
  res.json({ message: 'Endpoint 2 response' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
