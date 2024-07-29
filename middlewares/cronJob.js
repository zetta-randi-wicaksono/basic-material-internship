const cron = require('node-cron');
const Song = require('../models/song');

async function playSongs() {
  const song = await Song.aggregate().match({ played: false }).sort({ title: 1 }).limit(1);
  if (song) {
    const markSong = await Song.findByIdAndUpdate(
      song[0]._id,
      { played: true, playedAt: new Date().toISOString() },
      { new: true, useFindAndModify: false }
    );
    console.log(`Now ${markSong.playedAt} Play song ${markSong.title} by ${markSong.artist}`);
  }
}

cron.schedule('*/5 * * * *', playSongs, {
  scheduled: true,
  timezone: 'America/New_York',
});

module.exports = playSongs;
