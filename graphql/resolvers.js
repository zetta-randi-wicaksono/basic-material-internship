const Book = require('../models/book');
const Bookshelves = require('../models/bookshelves');

const resolvers = {
  Query: {
    getBooks: async () => {
      return await Book.find({});
    },
    getBookshelves: async () => {
      return await Bookshelves.find({});
    },
  },
};

module.exports = resolvers;
