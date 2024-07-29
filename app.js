const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const mongoose = require('mongoose');

const { typeDefs, resolvers } = require('./graphql');
const { authMiddleware } = require('./middlewares');

const app = express();
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

const server = new ApolloServer({
  schema: protectedSchema,
  context: (req) => ({
    req: req.req,
  }),
});

server.applyMiddleware({ app });

const port = 3000;

app.listen(port, () => {
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
});
