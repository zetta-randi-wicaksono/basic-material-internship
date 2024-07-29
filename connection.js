const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/';
const database = 'test-database';

const conn = mongoose
  .connect(`${url}${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return 'Connected to MongoDB';
  })
  .catch((error) => {
    return 'Error Connecting to MongoDB: ', error;
  });

module.exports = conn;
