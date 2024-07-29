const typeDefs = `
    type Query {
        title: String!
        price: Float!
        releaseYear: Int
        rating: Float
        isStock: Boolean!
    }
`;

const resolvers = {
  Query: {
    title() {
      return 'The War of Art';
    },
    price() {
      return 12.99;
    },
    releaseYear() {
      return null;
    },
    rating() {
      return 5;
    },
    isStock() {
      return true;
    },
  },
};

module.exports = { typeDefs, resolvers };
