const DataLoader = require('dataloader');
const Song = require('./models/song');

const batchSongs = async (song_ids) => {
  const songs = await Song.find({ _id: { $in: song_ids } });
  return song_ids.map((song_id) => songs.find((song) => song._id.toString() === song_id.toString()));
};

module.exports = new DataLoader(batchSongs);
