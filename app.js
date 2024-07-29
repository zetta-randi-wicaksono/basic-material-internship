const express = require('express');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const path = require('path');

const Book = require('./book-model.js');
const Bookshelves = require('./bookshelves-model.js');
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

// Book Function -----------------------------------------------------

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

// Bookshelves Function -----------------------------------------------------

async function readBookshelves() {
  return await Bookshelves.find({});
}

async function createBookshelves(listBookshelves) {
  const bookshelves = [];
  for (let i = 0; i < listBookshelves.length; i++) {
    const find = await Bookshelves.findOne({ name: listBookshelves[i].name });
    if (!find) {
      bookshelves.push(new Bookshelves(listBookshelves[i]));
    }
  }
  return Bookshelves.insertMany(bookshelves);
}

async function detailsBookshelves(bookshelvesId) {
  return await Bookshelves.findOne({ _id: mongoose.Types.ObjectId(bookshelvesId) });
}

async function findBookshelves(filter) {
  return await Bookshelves.find(filter);
}

async function updateBookshelves(bookshelvesId, bookshelvesDetails) {
  return await Bookshelves.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(bookshelvesId) }, bookshelvesDetails, {
    upsert: true,
    new: false,
    useFindAndModify: false,
  });
}

async function deleteBookshelves(bookshelvesId) {
  return await Bookshelves.findOneAndDelete({ _id: mongoose.Types.ObjectId(bookshelvesId) });
}

// Book Id in Bookshelves Function -----------------------------------------------------

async function addBookIdInBookshelves(bookshelvesId, listBookId) {
  const bookshelves = await detailsBookshelves(bookshelvesId);
  const listBookids = bookshelves.bookids;

  if (!listBookids.includes(listBookId)) {
    return await Bookshelves.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(bookshelvesId) },
      { $push: { bookids: listBookId } },
      { upsert: true, new: false, useFindAndModify: false }
    );
  }
}

async function deleteBookIdInBookshelves(bookshelvesId, listBookId) {
  return await Bookshelves.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(bookshelvesId) },
    { $pull: { bookids: listBookId } },
    { upsert: true, new: false, useFindAndModify: false }
  );
}

async function filterBookshelvesByBookId(bookId) {
  return await Bookshelves.find({ bookids: bookId });
}

// Book -----------------------------------------------------

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
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Book Already Added' });
  }
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
  if (result.length > 0) {
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

// Bookshelves -----------------------------------------------------

app.get('/bookshelves', auth, async (req, res) => {
  const result = await readBookshelves();
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Bookshelves is Empty' });
  }
});

app.post('/bookshelves/add', auth, async (req, res) => {
  const listBookshelves = req.body;
  const result = await createBookshelves(listBookshelves);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Bookshelves Already Added' });
  }
});

app.get('/bookshelves/:id', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const result = await detailsBookshelves(bookshelvesId);
  if (result) {
    res.json(result);
  } else {
    res.send({ message: 'The Bookshelves Not Found' });
  }
});

app.post('/bookshelves/find', auth, async (req, res) => {
  const filter = req.body;
  console.log(filter);
  const result = await findBookshelves(filter);
  console.log(result);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Bookshelves Not Found' });
  }
});

app.post('/bookshelves/update/:id', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const bookshelvesDetails = req.body;
  const result = await updateBookshelves(bookshelvesId, bookshelvesDetails);
  if (result) {
    const bookshelves = await detailsBookshelves(result._id);
    res.json([bookshelves, { message: 'Update Bookshelves Success' }]);
  } else {
    res.send({ message: 'The Bookshelves Not Found' });
  }
});

app.post('/bookshelves/delete/:id', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const result = await deleteBookshelves(bookshelvesId);
  if (result) {
    res.json([result, { message: 'Delete Bookshelves Success' }]);
  } else {
    res.send({ message: 'The Bookshelves Not Found' });
  }
});

// Book Id in Bookshelves -----------------------------------------------------

app.post('/bookshelves/:id/bookId/add/:bookId', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const bookId = req.params.bookId;
  const result = await addBookIdInBookshelves(bookshelvesId, bookId);
  if (result) {
    const bookshelves = await detailsBookshelves(result._id);
    res.json(bookshelves);
  } else {
    res.send({ message: 'The Bookshelves Already Added' });
  }
});

app.post('/bookshelves/:id/bookId/delete/:bookId', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const listBookId = req.params.bookId;
  const result = await deleteBookIdInBookshelves(bookshelvesId, listBookId);
  if (result) {
    const bookshelves = await detailsBookshelves(result._id);
    res.json(bookshelves);
  }
});

app.get('/bookshelves/filter/bookids/:id', auth, async (req, res) => {
  const bookId = req.params.id;
  const result = await filterBookshelvesByBookId(bookId);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Bookshelves Not Found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
