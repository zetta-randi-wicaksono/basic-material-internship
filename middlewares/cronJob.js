const cron = require('node-cron');
const Song = require('../models/song');

async function playSongs() {
  const song = await Song.findOne({ played: false });
  if (song) {
    const markSong = await Song.findByIdAndUpdate(
      song._id,
      { played: true, playedAt: new Date().toISOString() },
      { new: true, useFindAndModify: false }
    );
    console.log(`Now ${markSong.playedAt} Play song ${markSong.title} by ${markSong.artist}`);
    return markSong;
  }
}

cron.schedule('*/5 * * * *', playSongs, {
  scheduled: true,
  timezone: 'America/New_York',
});

module.exports = playSongs;
