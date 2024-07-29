const Song = require('../models/song');

exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, useFindAndModify: false });
    if (!song) {
      return res.status(404).send('Song not found');
    }
    res.send(song);
  } catch (error) {
    res.status(400).send(error);
  }
};
