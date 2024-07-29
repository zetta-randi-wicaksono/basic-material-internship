const express = require('express');
const basicAuth = require('basic-auth');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');

const Book = require('./models/book.js');
const Bookshelves = require('./models/bookshelves.js');
const conn = require('./models/connection.js');

const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers.js');
// const { authMiddleware } = require('./middlewares/auth.js');

const app = express();
const port = 3000;
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());

const server = new ApolloServer({
  schema: protectedSchema,
  context: (req) => ({
    req: req.req,
  }),
});

server.applyMiddleware({ app });

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

// Bestseller in Bookshelves Function -----------------------------------------------------

async function addBestsellerInBookshelves(bookshelvesId, bookId, bestsellerDetail) {
  // const soba = await Bookshelves.distinct('bestseller._id');
  // console.log(soba);
  // console.log(typeof soba);
  // return soba;
  // return await Bookshelves.distinct('bestseller.sales');
  return await Bookshelves.updateOne(
    { _id: mongoose.Types.ObjectId(bookshelvesId) },
    { $push: { bestseller: { _id: mongoose.Types.ObjectId(bookId), sales: bestsellerDetail.sales, rating: bestsellerDetail.rating } } },
    { upsert: true, new: false, useFindAndModify: false }
  );
}

async function deleteBestsellerInBookshelves(bookshelvesId, bookId) {
  return await Bookshelves.updateOne(
    { _id: mongoose.Types.ObjectId(bookshelvesId) },
    { $pull: { bestseller: { _id: mongoose.Types.ObjectId(bookId) } } },
    { upsert: true, new: false, useFindAndModify: false }
  );
}

async function updateBestsellerInBookshelves(bookshelvesId, bookId, bestsellerDetail) {
  return await Bookshelves.updateOne(
    { _id: mongoose.Types.ObjectId(bookshelvesId) },
    { $set: { 'bestseller.$[item].sales': bestsellerDetail.sales, 'bestseller.$[item].rating': bestsellerDetail.rating } },
    { arrayFilters: [{ 'item._id': mongoose.Types.ObjectId(bookId) }] }
  );
}

async function filterBestsellerByBookId(bookId) {
  return await Bookshelves.find({ bestseller: { $elemMatch: { _id: bookId } } });
}

async function getListInBook(key) {
  return await Book.distinct(key);
}

// DAY 5 Function -----------------------------------------------------

async function filterUsingProjection() {
  return await Book.aggregate([{ $project: { _id: 0, title: 1, author: 1, publisher: 1 } }]);
}

async function additionalFields() {
  return await Book.aggregate([
    { $addFields: { priceDiscount: { $subtract: ['$price', { $multiply: ['$price', { $divide: ['$discountPercent', 100] }] }] } } },
  ]);
}

async function unwindQuery() {
  return await Bookshelves.aggregate([
    { $unwind: '$bookids' },
    { $group: { _id: '$bookids', bookshelves_id: { $push: { _id: '$_id', playlist: '$name' } } } },
  ]);
}

// DAY 6 Function -----------------------------------------------------

async function filterUsingMatch(filter) {
  return await Book.aggregate([{ $match: filter }]);
}

async function sortBook(filter) {
  return await Book.aggregate([{ $sort: filter }]);
}

async function concatTitleAuthor() {
  return await Book.aggregate([{ $addFields: { title_author: { $concat: ['$title', ' ', '$author'] } } }]);
}

async function bookshelvesBookDetails() {
  return await Bookshelves.aggregate([{ $lookup: { from: 'books', localField: 'bookids', foreignField: '_id', as: 'book_details' } }]);
}

// DAY 7 Function -----------------------------------------------------

async function paginationBook(page, limit) {
  return await Book.aggregate([
    {
      $facet: {
        page: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $project: { _id: 0, title: 1, author: 1, genre: 1, stok: 1, price: 1 } },
        ],
        song: [{ $count: 'total_book' }],
      },
    },
  ]);
}

// Book -----------------------------------------------------

app.get('/book', auth, async (req, res) => {
  const result = await readBook();
  if (result.length > 0) {
    res.json({ result, length: result.length });
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

// Best Seller in Bookshelves -----------------------------------------------------

app.post('/bookshelves/:id/bestseller/add/:bookId', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const bookId = req.params.bookId;
  const bestseller = req.body;
  const result = await addBestsellerInBookshelves(bookshelvesId, bookId, bestseller);
  res.json(result);
});

app.post('/bookshelves/:id/bestseller/delete/:bookId', auth, async (req, res) => {
  const bookshelvesId = req.params.id;
  const bookId = req.params.bookId;
  const result = await deleteBestsellerInBookshelves(bookshelvesId, bookId);
  res.json(result);
});

app.post('/bookshelves/:id/bestseller/update/:bookId', auth, async (req, res) => {
  const bookshelves = req.params;
  const bestsellerDetail = req.body;
  const result = await updateBestsellerInBookshelves(bookshelves.id, bookshelves.bookId, bestsellerDetail);
  res.json(result);
});

app.get('/bookshelves/filter/bestseller/:id', auth, async (req, res) => {
  const bookId = req.params.id;
  const result = await filterBestsellerByBookId(bookId);
  res.json(result);
});

app.get('/book/getList/:key', auth, async (req, res) => {
  const key = req.params.key;
  const result = await getListInBook(key);
  res.json(result);
});

// DAY 5 -----------------------------------------------------

app.post('/book/list', auth, async (req, res) => {
  const result = await filterUsingProjection();
  res.json(result);
});

app.post('/book/cart', auth, async (req, res) => {
  const result = await additionalFields();
  res.json(result);
});

app.post('/book/bookshelves', auth, async (req, res) => {
  const result = await unwindQuery();
  res.json(result);
});

// DAY 6 -----------------------------------------------------

app.post('/book/filter', auth, async (req, res) => {
  const fitler = req.body;
  const result = await filterUsingMatch(fitler);
  res.json(result);
});

app.post('/book/sort', auth, async (req, res) => {
  const fitler = req.body;
  const result = await sortBook(fitler);
  res.json(result);
});

app.post('/book/concat', auth, async (req, res) => {
  const result = await concatTitleAuthor();
  res.json(result);
});

app.post('/bookshelves/bookdetails', auth, async (req, res) => {
  const result = await bookshelvesBookDetails();
  res.json(result);
});

// DAY 7 -----------------------------------------------------

app.post('/book/pagination', auth, async (req, res) => {
  const page = req.body.page;
  const limit = req.body.limit;
  const result = await paginationBook(page, limit);
  res.json(result);
});

app.listen(port, async () => {
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
  await connection();
});
