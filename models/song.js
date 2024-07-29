const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  released: { type: Date, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true },
  album: { type: String, required: true },
  played: { type: Boolean, default: false },
  playedAt: { type: Date, default: null },
});

module.exports = new mongoose.model('Song', songSchema);
