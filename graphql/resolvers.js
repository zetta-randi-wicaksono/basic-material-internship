const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const User = require('../models/user');
const Book = require('../models/book');
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
    signup: async (_, { input }, context, info) => {
      const password = await bcrypt.hash(input.password, 10);
      const user = await User.create({
        username: input.username,
        password,
      });
      // const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
      return { user: { id: user._id, username: user.username } };
    },

    signin: async (parent, { input }, context, info) => {
      const user = await User.findOne({ username: input.username });
      if (!user) {
        throw new Error('User Not Found');
      }
      const matched = await bcrypt.compare(input.password, user.password);
      if (!matched) {
        throw new Error('Invalid Password');
      }
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user: { id: user._id, username: user.username } };
    },

    createBook: async (parent, args) => {
      const book = new Book(args);
      await book.save();
      return book;
    },

    updateBook: async (parent, args) => {
      const { id, ...updateData } = args;
      const book = await Book.findByIdAndUpdate(id, updateData, { new: true });
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
      const bookshelves = await Bookshelves.findByIdAndUpdate(id, updateData, { upsert: true, new: true, useFindAndModify: false });
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
        { upsert: true, new: true, useFindAndModify: false }
      );
      return bookshelves;
    },

    deleteBookIdInBookshelves: async (parent, args) => {
      const { id, bookid } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $pull: { bookids: bookid } },
        { upsert: true, new: true, useFindAndModify: false }
      );
      return bookshelves;
    },

    addBestsellerIdInBookshelves: async (parent, args) => {
      const { id, ...updateData } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $push: { bestseller: updateData } },
        { upsert: true, new: true, useFindAndModify: false }
      );
      return bookshelves;
    },

    deleteBestsellerIdInBookshelves: async (parent, args) => {
      const { id, bestseller_id } = args;
      const bookshelves = await Bookshelves.findByIdAndUpdate(
        id,
        { $pull: { bestseller: { _id: bestseller_id } } },
        { upsert: true, new: true, useFindAndModify: false }
      );
      return bookshelves;
    },
  },

  Bookshelves: {
    bookids: async (bookshelves, args, context) => {
      const { bookLoader } = context.loaders;
      const book = await bookLoader.loadMany(bookshelves.bookids);
      return book;
    },

    bestseller: async (bookshelves, args, context) => {
      const { bookLoader } = context.loaders;
      return await bookshelves.bestseller.map(async (bestseller) => {
        const book = await bookLoader.load(bestseller.id);
        return {
          id: book,
          sales: bestseller.sales,
          rating: bestseller.rating,
        };
      });
    },
  },
};

module.exports = resolvers;
