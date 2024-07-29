const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID
    username: String
  }

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
    id: Book
    sales: Int
    rating: Int
  }

  type Bookshelves {
    id: ID!
    name: String!
    bookids: [Book]
    bestseller: [bestseller]
  }

  type Query {
    getBooks: [Book]
    getBookById(id: ID!): Book
    getBookshelves: [Bookshelves]
    getBookshelvesById(id: ID!): Bookshelves
  }

  type AuthPayload {
    token: String!
    user: User
  }

  input AuthInput {
    username: String!
    password: String!
  }

  type Mutation {
    signup(input: AuthInput!): AuthPayload
    signin(input: AuthInput!): AuthPayload

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
