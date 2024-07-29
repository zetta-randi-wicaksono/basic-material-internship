const express = require('express');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const path = require('path');

const Book = require('./book-model.js');
const conn = require('./connection.js');
const { read } = require('fs');
const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());

async function connection() {
  console.log(await conn);
}

function auth(req, res, next) {
  const user = basicAuth(req);
  if (user && user.name === 'admin' && user.pass === 'password') {
    return next();
  } else {
    return res.json('Access Denied.');
  }
}

async function detailsBook(bookId) {
  return await Book.findOne({ _id: mongoose.Types.ObjectId(bookId) });
}

async function findBook(filter) {
  return await Book.find(filter);
}

async function createBook(listBook) {
  const books = [];
  for (let i = 0; i < listBook.length; i++) {
    const find = await Book.findOne({ title: listBook[i].title });
    if (!find) {
      books.push(new Book(listBook[i]));
    }
  }
  return Book.insertMany(books);
}

function readBook() {
  return Book.find({});
}

async function updateBook(bookId, bookDetails) {
  return await Book.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(bookId) }, bookDetails, {
    upsert: true,
    new: false,
    useFindAndModify: false,
  });
}

async function deleteBook(bookId) {
  return await Book.findOneAndDelete({ _id: mongoose.Types.ObjectId(bookId) });
}

app.get('/book', auth, async (req, res) => {
  await connection();
  const result = await readBook();
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Book is Empty' });
  }
});

app.post('/book/add', auth, async (req, res) => {
  const listBook = req.body;
  const result = await createBook(listBook);
  res.json(result);
});

app.get('/book/:id', auth, async (req, res) => {
  const bookId = req.params.id;
  const result = await detailsBook(bookId);
  if (result) {
    res.json(result);
  } else {
    res.send({ message: 'The Book Not Found' });
  }
});

app.post('/book/find', auth, async (req, res) => {
  const filter = req.body;
  const result = await findBook(filter);
  if (result) {
    res.json(result);
  } else {
    res.send({ message: 'The Book Not Found' });
  }
});

app.post('/book/update/:id', auth, async (req, res) => {
  const bookId = req.params.id;
  const bookDetails = req.body;
  const result = await updateBook(bookId, bookDetails);
  if (result) {
    const book = await detailsBook(result._id);
    res.json([book, { message: 'Update Book Success' }]);
  } else {
    res.send({ message: 'The Book Not Found' });
  }
});

app.post('/book/delete/:id', auth, async (req, res) => {
  const bookId = req.params.id;
  const result = await deleteBook(bookId);
  if (result) {
    res.json([result, { message: 'Delete Book Success' }]);
  } else {
    res.send({ message: 'The Book Not Found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
