const DataLoader = require('dataloader');
const Book = require('../models/book');

const batchBooks = async (bookIds) => {
  const books = await Book.find({ _id: { $in: bookIds } });
  return bookIds.map((bookId) => books.find((book) => book._id.toString() === bookId.toString()));
};

module.exports = new DataLoader(batchBooks);
