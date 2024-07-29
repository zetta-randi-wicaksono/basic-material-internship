const mongoose = require('mongoose');

const bookshelvesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bookids: [{ type: mongoose.Types.ObjectId, ref: 'Book' }],
  bestseller: [
    {
      _id: { type: mongoose.Types.ObjectId, ref: 'Book' },
      sales: { type: Number },
      rating: { type: Number },
    },
  ],
});

module.exports = new mongoose.model('bookshelves', bookshelvesSchema);
