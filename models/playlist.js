const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: { type: String, required: true },
  song_ids: [{ type: mongoose.Types.ObjectId, ref: 'song' }],
  n_song: { type: Number },
  duration: { type: Number },
});

module.exports = new mongoose.model('Playlist', playlistSchema);
