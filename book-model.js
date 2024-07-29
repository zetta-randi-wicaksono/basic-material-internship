const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  genre: { type: String, required: true },
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  discount: { type: Boolean, required: true },
  discountPercent: { type: Number, required: true },
});

module.exports = new mongoose.model('Book', bookSchema);
