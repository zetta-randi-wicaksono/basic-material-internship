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
    bookids: [ID!]!
    bestseller: [bestseller!]!
  }

  type Query {
    getBooks: [Book]
    getBookshelves: [Bookshelves]
  }
`;

module.exports = typeDefs;
