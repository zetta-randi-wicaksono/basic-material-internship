const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');

const conn = require('./models/connection.js');
const typeDefs = require('./graphql/typeDefs.js');
const resolvers = require('./graphql/resolvers.js');
const authMiddleware = require('./middlewares/auth.js');
const songLoader = require('./dataloaders.js');
const songRoutes = require('./routes/songRoutes.js');

const app = express();
const port = 3000;
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });
const protectedSchema = applyMiddleware(executableSchema, authMiddleware);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/song', songRoutes);

const server = new ApolloServer({
  schema: protectedSchema,
  context: ({ req }) => ({
    req,
    loaders: { songLoader },
  }),
});

server.applyMiddleware({ app });

async function connection() {
  console.log(await conn);
}

app.listen(port, async () => {
  await connection();
  console.log(`GraphQL server is running on http://localhost:${port}/graphql`);
});
