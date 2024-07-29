const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

let songs = [];
// let songs = [
//   {
//     title: 'Forgot Password',
//     artist: 'Hindia',
//     released: '2023',
//     genre: 'Indonesian Pop',
//     duration: 217,
//     album: 'Lagipula Hidup Akan Berakhir',
//   },
//   {
//     title: 'Sunshine',
//     artist: 'The Panturas',
//     released: '2018',
//     genre: 'Rock',
//     duration: 284,
//     album: 'Mabuk Laut',
//   },
//   {
//     title: 'Gas',
//     artist: 'FSTVLST',
//     released: '2020',
//     genre: 'Indonesian Pop',
//     duration: 214,
//     album: 'FSTVLST II',
//   },
//   {
//     title: 'Evakuasi',
//     artist: 'Hindia',
//     released: '2019',
//     genre: 'Indonesian Pop',
//     duration: 211,
//     album: 'Menari Dengan Bayangan',
//   },
//   {
//     title: 'Tafsir Mistik',
//     artist: 'The Panturas',
//     released: '2021',
//     genre: 'Indonesian Indie',
//     duration: 305,
//     album: 'Ombak Banyu Asmara',
//   },
// ];

function groupArtists(songs) {
  const groupBy = {};

  for (let song of songs) {
    const artist = song.artist;
    if (!groupBy[artist]) {
      groupBy[artist] = [];
    }
    groupBy[artist].push(song);
  }
  return groupBy;
}

function groupGenres(songs) {
  const groupBy = {};

  for (let song of songs) {
    const genre = song.genre;
    if (!groupBy[genre]) {
      groupBy[genre] = [];
    }
    groupBy[genre].push(song);
  }
  return groupBy;
}

function makePlaylist(songs) {
  const maxDuration = 3600;
  const selectedSongs = [];
  const indexSet = new Set();
  let totalDuration = 0;

  do {
    const index = Math.floor(Math.random() * songs.length);
    if (!indexSet.has(index)) {
      const randomSong = songs[index];
      if (totalDuration + randomSong.duration > maxDuration) {
        break;
      }
      indexSet.add(index);
      selectedSongs.push(randomSong);
      totalDuration += randomSong.duration;
    }
  } while (totalDuration < maxDuration);

  const numberOfSong = selectedSongs.length;
  const indexArray = Array.from(indexSet);
  const numberOfIndex = indexArray.length;
  return { selectedSongs, totalDuration, indexArray, numberOfIndex, numberOfSong };
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

app.get('/get_songs', authenticateToken, (req, res) => {
  songs = req.body;
  res.send(songs);

  // if (username === 'user' && password === 'password') {
  //   const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  //   res.json({ token });
  // } else {
  //   res.status(401).json({ message: 'Invalid credentials' });
  // }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'user' && password === 'password') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/groupArtists', authenticateToken, (req, res) => {
  res.json(groupArtists(songs));
});

app.post('/groupGenres', authenticateToken, (req, res) => {
  res.json(groupGenres(songs));
});

app.post('/makePlaylist', authenticateToken, (req, res) => {
  res.json(makePlaylist(songs));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
