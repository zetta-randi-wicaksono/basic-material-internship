const mongoose = require('mongoose');

const bookshelvesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bookids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

module.exports = new mongoose.model('bookshelves', bookshelvesSchema);
