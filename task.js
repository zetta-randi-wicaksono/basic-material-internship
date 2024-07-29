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
  let totalDuration = 0;

  do {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    if (totalDuration + randomSong.duration > maxDuration) {
      break;
    }
    selectedSongs.push(randomSong);
    totalDuration += randomSong.duration;
  } while (totalDuration < maxDuration);

  console.log(totalDuration);

  return selectedSongs;
}

let songs = [
  {
    title: 'Forgot Password',
    artist: 'Hindia',
    released: '2023',
    genre: 'Indonesian Pop',
    duration: 217,
    album: 'Lagipula Hidup Akan Berakhir',
  },
  {
    title: 'Sunshine',
    artist: 'The Panturas',
    released: '2018',
    genre: 'Rock',
    duration: 284,
    album: 'Mabuk Laut',
  },
  {
    title: 'Gas',
    artist: 'FSTVLST',
    released: '2020',
    genre: 'Indonesian Pop',
    duration: 214,
    album: 'FSTVLST II',
  },
  {
    title: 'Evakuasi',
    artist: 'Hindia',
    released: '2019',
    genre: 'Indonesian Pop',
    duration: 211,
    album: 'Menari Dengan Bayangan',
  },
  {
    title: 'Tafsir Mistik',
    artist: 'The Panturas',
    released: '2021',
    genre: 'Indonesian Indie',
    duration: 305,
    album: 'Ombak Banyu Asmara',
  },
];

console.log(groupArtists(songs));
console.log(groupGenres(songs));
console.log(makePlaylist(songs));
