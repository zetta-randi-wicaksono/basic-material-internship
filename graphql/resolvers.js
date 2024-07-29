const Book = require('../models/book');
const mongoose = require('mongoose');
const Bookshelves = require('../models/bookshelves');

const resolvers = {
  Query: {
    getBooks: async () => {
      return await Book.find({});
    },

    getBookById: async (parent, args) => {
      return await Book.findById(args.id);
    },

    getBookshelves: async () => {
      return await Bookshelves.find({});
    },

    getBookshelvesById: async (parent, args) => {
      return await Bookshelves.findById(args.id);
    },
  },
  Mutation: {
    createBook: async (parent, args) => {
      const book = new Book(args);
      await book.save();
      return book;
    },

    updateBook: async (parent, args) => {
      const { id, ...updateData } = args;
      const book = await Book.findByIdAndUpdate(id, updateData, { upsert: true, new: false, useFindAndModify: false });
      return book;
    },

    deleteBook: async (parent, args) => {
      const book = await Book.findByIdAndDelete(args.id);
      return book;
    },

    createBookshelves: async (parent, args) => {
      const bookshelves = new Bookshelves(args);
      await bookshelves.save();
      return bookshelves;
    },

    updateBookshelves: async (parent, args) => {
      const { id, ...updateData } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(id, updateData, { upsert: true, new: false, useFindAndModify: false });
      return bookshelves;
    },

    deleteBookshelves: async (parent, args) => {
      const bookshelves = await Bookshelves.findByIdAndDelete(args.id);
      return bookshelves;
    },

    addBookIdInBookshelves: async (parent, args) => {
      const { id, bookid } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $push: { bookids: bookid } },
        { upsert: true, new: false, useFindAndModify: false }
      );
      return bookshelves;
    },

    deleteBookIdInBookshelves: async (parent, args) => {
      const { id, bookid } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $pull: { bookids: bookid } },
        { upsert: true, new: false, useFindAndModify: false }
      );
      return bookshelves;
    },

    addBestsellerIdInBookshelves: async (parent, args) => {
      const { id, ...updateData } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $push: { bestseller: updateData } },
        { upsert: true, new: false, useFindAndModify: false }
      );
      return bookshelves;
    },

    deleteBestsellerIdInBookshelves: async (parent, args) => {
      const { id, bestseller_id } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $pull: { bestseller: { _id: bestseller_id } } },
        { upsert: true, new: false, useFindAndModify: false }
      );
      return bookshelves;
    },
  },
};

module.exports = resolvers;
