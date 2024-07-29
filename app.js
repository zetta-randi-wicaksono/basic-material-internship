const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

const conn = require('./connection.js');
const Song = require('./song-model.js');
const Playlist = require('./playlist-model.js');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(bodyParser.json());

async function connection() {
  console.log(await conn);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user' && password === 'password') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Song Function -----------------------------------------------------------------

async function detailsSong(songId) {
  return await Song.findOne({ _id: mongoose.Types.ObjectId(songId) });
}

async function findSong(filter) {
  return await Song.find(filter);
}

async function createSong(listSong) {
  const songs = [];
  for (let i = 0; i < listSong.length; i++) {
    const find = await Song.findOne({ title: listSong[i].title });
    if (!find) {
      songs.push(new Song(listSong[i]));
    }
  }
  return Song.insertMany(songs);
}

function readSong() {
  return Song.find({});
}

async function updateSong(songId, songDetails) {
  return await Song.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(songId) }, songDetails, {
    upsert: true,
    new: false,
    useFindAndModify: false,
  });
}

async function deleteSong(songId) {
  return await Song.findOneAndDelete({ _id: mongoose.Types.ObjectId(songId) });
}

// Playlist Function -----------------------------------------------------

async function readPlaylist() {
  return await Playlist.find({});
}

async function createPlaylist(listPlaylist) {
  const playlists = [];
  for (let i = 0; i < listPlaylist.length; i++) {
    const find = await Playlist.findOne({ title: listPlaylist[i].title });
    if (!find) {
      playlists.push(new Playlist(listPlaylist[i]));
    }
  }
  return Playlist.insertMany(playlists);
}

async function detailsPlaylist(playlistId) {
  return await Playlist.findOne({ _id: mongoose.Types.ObjectId(playlistId) });
}

async function findPlaylist(filter) {
  return await Playlist.find(filter);
}

async function updatePlaylist(playlistId, playlistDetails) {
  return await Playlist.findOneAndUpdate({ _id: mongoose.Types.ObjectId(playlistId) }, playlistDetails, {
    upsert: true,
    new: false,
    useFindAndModify: false,
  });
}

async function deletePlaylist(playlistId) {
  return await Playlist.findOneAndDelete({ _id: mongoose.Types.ObjectId(playlistId) });
}

// Song in Playlist Function -----------------------------------------------------

async function addSongIdInPlaylist(playlistId, listSongId) {
  const playlists = await detailsPlaylist(playlistId);
  const listSongids = playlists.song_ids;

  if (!listSongids.includes(listSongId)) {
    return await Playlist.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(playlistId) },
      { $push: { song_ids: listSongId } },
      { upsert: true, new: false, useFindAndModify: false }
    );
  }
}

async function deleteSongIdInPlaylist(bookshelvesId, listSongId) {
  return await Playlist.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(bookshelvesId) },
    { $pull: { song_ids: listSongId } },
    { upsert: true, new: false, useFindAndModify: false }
  );
}

async function filterPlaylistBySongId(songId) {
  return await Playlist.find({ song_ids: songId });
}

// DAY 8 Function -----------------------------------------------------

async function getAllSongs(allSongs) {
  const songs = allSongs.songs;
  const page = allSongs.page;
  const limit = allSongs.limit;

  return await Song.aggregate([
    {
      $facet: {
        songs: [
          { $match: songs[0] },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $sort: songs[1] },
          {
            $lookup: {
              from: 'playlists',
              localField: '_id',
              foreignField: 'song_ids',
              as: 'associatedPlaylists',
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              artist: 1,
              genre: 1,
              playlistTitles: {
                $cond: { if: { $gt: [{ $size: '$associatedPlaylists' }, 0] }, then: '$associatedPlaylists.title', else: '$$REMOVE' },
              },
            },
          },
        ],
        genres: [
          { $match: songs[0] },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $group: { _id: '$genre', song: { $push: '$title' } } },
        ],
        total_songs: [{ $count: 'total' }],
      },
    },
  ]);
}

async function getAllPlaylist(allPlaylist) {
  const playlists = allPlaylist.playlists;
  const songs = allPlaylist.songs;

  return await Playlist.aggregate([
    {
      $facet: {
        playlist: [
          { $match: playlists[0] },
          { $skip: (playlists[2].page - 1) * playlists[2].limit },
          { $limit: playlists[2].limit },
          { $sort: playlists[1] },
          {
            $lookup: {
              from: 'songs',
              localField: 'song_ids',
              foreignField: '_id',
              as: 'associatedSongs',
            },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              artist: 1,
              genre: 1,
              associatedSongs: {
                $cond: { if: { $gt: [{ $size: '$associatedSongs' }, 0] }, then: '$associatedSongs.title', else: '$$REMOVE' },
              },
            },
          },
        ],
        songs: [
          {
            $lookup: {
              from: 'songs',
              localField: 'song_ids',
              foreignField: '_id',
              as: 'associatedSongs',
            },
          },
          { $match: playlists[0] },
          { $unwind: '$associatedSongs' },
          { $group: { _id: '$associatedSongs', playlist: { $push: '$title' } } },
          { $skip: (songs.page - 1) * songs.limit },
          { $limit: songs.limit },
          {
            $project: {
              _id: '$_id._id',
              title: '$_id.title',
              artist: '$_id.artist',
              genre: '$_id.genre',
              duration: '$_id.duration',
              playlist: 1,
            },
          },
        ],
        total_playlist: [{ $count: 'total' }],
      },
    },
  ]);
}

// Song -----------------------------------------------------------------

app.get('/song', authenticateToken, async (req, res) => {
  const result = await readSong();
  if (result.length > 0) {
    res.json({ result, length: result.length });
  } else {
    res.send({ message: 'The Song is Empty' });
  }
});

app.post('/song/add', authenticateToken, async (req, res) => {
  const listSong = req.body;
  const result = await createSong(listSong);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Song Already Added' });
  }
});

app.get('/song/:id', authenticateToken, async (req, res) => {
  const songId = req.params.id;
  const result = await detailsSong(songId);
  if (result) {
    res.json(result);
  } else {
    res.send({ message: 'The Song Not Found' });
  }
});

app.post('/song/find', authenticateToken, async (req, res) => {
  const filter = req.body;
  const result = await findSong(filter);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Song Not Found' });
  }
});

app.post('/song/update/:id', authenticateToken, async (req, res) => {
  const songId = req.params.id;
  const songDetails = req.body;
  const result = await updateSong(songId, songDetails);
  if (result) {
    const song = await detailsSong(result._id);
    res.json([song, { message: 'Update Song Success' }]);
  } else {
    res.send({ message: 'The Song Not Found' });
  }
});

app.post('/song/delete/:id', authenticateToken, async (req, res) => {
  const songId = req.params.id;
  const result = await deleteSong(songId);
  if (result) {
    res.json([result, { message: 'Delete Song Success' }]);
  } else {
    res.send({ message: 'The Song Not Found' });
  }
});

// Playlist -----------------------------------------------------

app.get('/playlist', authenticateToken, async (req, res) => {
  const result = await readPlaylist();
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Playlist is Empty' });
  }
});

app.post('/playlist/add', authenticateToken, async (req, res) => {
  const listPlaylist = req.body;
  const result = await createPlaylist(listPlaylist);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Playlist Already Added' });
  }
});

app.get('/playlist/:id', authenticateToken, async (req, res) => {
  const playlistId = req.params.id;
  const result = await detailsPlaylist(playlistId);
  if (result) {
    res.json(result);
  } else {
    res.send({ message: 'The Playlist Not Found' });
  }
});

app.post('/playlist/find', authenticateToken, async (req, res) => {
  const filter = req.body;
  const result = await findPlaylist(filter);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Playlist Not Found' });
  }
});

app.post('/playlist/update/:id', authenticateToken, async (req, res) => {
  const playlistId = req.params.id;
  const playlistDetails = req.body;
  const result = await updatePlaylist(playlistId, playlistDetails);
  if (result) {
    const playlist = await detailsPlaylist(result._id);
    res.json([playlist, { message: 'Update Playlist Success' }]);
  } else {
    res.send({ message: 'The Playlist Not Found' });
  }
});

app.post('/playlist/delete/:id', authenticateToken, async (req, res) => {
  const playlistId = req.params.id;
  const result = await deletePlaylist(playlistId);
  if (result) {
    res.json([result, { message: 'Delete Playlist Success' }]);
  } else {
    res.send({ message: 'The Playlist Not Found' });
  }
});

// Song Id in Playlist -----------------------------------------------------

app.post('/playlist/:id/add/:songId', authenticateToken, async (req, res) => {
  const playlistId = req.params.id;
  const songId = req.params.songId;
  const result = await addSongIdInPlaylist(playlistId, songId);
  if (result) {
    const playlists = await detailsPlaylist(result._id);
    res.json(playlists);
  } else {
    res.send({ message: 'The Song Already Added' });
  }
});

app.post('/playlist/:id/delete/:songId', authenticateToken, async (req, res) => {
  const playlistId = req.params.id;
  const songId = req.params.songId;
  const result = await deleteSongIdInPlaylist(playlistId, songId);
  if (result) {
    const playlists = await detailsPlaylist(result._id);
    res.json(playlists);
  }
});

app.get('/playlist/filter/songId/:id', authenticateToken, async (req, res) => {
  const songId = req.params.id;
  const result = await filterPlaylistBySongId(songId);
  if (result.length > 0) {
    res.json(result);
  } else {
    res.send({ message: 'The Playlist Not Found' });
  }
});

// DAY 8  -----------------------------------------------------

app.post('/songs/all/', authenticateToken, async (req, res) => {
  const allSongs = req.body;
  const result = await getAllSongs(allSongs);
  res.send(result);
});

app.post('/playlists/all/', authenticateToken, async (req, res) => {
  const allPlaylist = req.body;
  const result = await getAllPlaylist(allPlaylist);
  res.send(result);
});

// -----------------------------------------------------------------

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  await connection();
});
