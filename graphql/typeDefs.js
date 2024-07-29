const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    publisher: String!
    genre: String!
    stock: Int!
    price: Int!
    discount: Boolean!
    discountPercent: Int!
  }

  type bestseller {
    id: ID
    sales: Int
    rating: Int
  }

  type Bookshelves {
    id: ID!
    name: String!
    bookids: [ID]
    bestseller: [bestseller]
  }

  type Query {
    getBooks: [Book]
    getBookById(id: ID!): Book
    getBookshelves: [Bookshelves]
    getBookshelvesById(id: ID!): Bookshelves
  }

  type Mutation {
    createBook(
      title: String!
      author: String!
      publisher: String!
      genre: String!
      stock: Int!
      price: Int!
      discount: Boolean!
      discountPercent: Int!
    ): Book

    updateBook(
      id: ID!
      title: String
      author: String
      publisher: String
      genre: String
      stock: Int
      price: Int
      discount: Boolean
      discountPercent: Int
    ): Book

    deleteBook(id: ID!): Book

    createBookshelves(name: String!): Bookshelves

    updateBookshelves(id: ID!, name: String): Bookshelves

    deleteBookshelves(id: ID!): Bookshelves

    addBookIdInBookshelves(id: ID!, bookid: ID!): Bookshelves

    deleteBookIdInBookshelves(id: ID!, bookid: ID!): Bookshelves

    addBestsellerIdInBookshelves(id: ID!, _id: ID!, sales: Int!, rating: Int!): Bookshelves

    deleteBestsellerIdInBookshelves(id: ID!, bestseller_id: ID!): Bookshelves
  }
`;

module.exports = typeDefs;
