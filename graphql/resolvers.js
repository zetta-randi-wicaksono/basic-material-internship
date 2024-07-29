const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const User = require('../models/user');
const Song = require('../models/song');
const Playlist = require('../models/playlist');

const resolvers = {
  Query: {
    getSongs: async () => {
      return await Song.find({});
    },

    getSongById: async (parent, args) => {
      return await Song.findById(args.id);
    },

    getPlaylists: async () => {
      return await Playlist.find({});
    },

    getPlaylistById: async (parent, args) => {
      return await Playlist.findById(args.id);
    },

    getUsers: async () => {
      return await User.find({});
    },

    getUserById: async (parent, args) => {
      return await User.findById(args.id);
    },
  },

  Mutation: {
    signup: async (_, { input }, context, info) => {
      const password = await bcrypt.hash(input.password, 10);
      const user = await User.create({
        username: input.username,
        password,
      });
      // const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
      return { user: { id: user._id, username: user.username } };
    },

    signin: async (parent, { input }, context, info) => {
      const user = await User.findOne({ username: input.username });
      if (!user) {
        throw new Error('User Not Found');
      }
      const matched = await bcrypt.compare(input.password, user.password);
      if (!matched) {
        throw new Error('Invalid Password');
      }
      const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, user: { id: user._id, username: user.username } };
    },

    createSong: async (parent, args) => {
      const song = new Song(args);
      await song.save();
      return song;
    },

    updateSong: async (parent, args) => {
      const { id, ...updateData } = args;
      const song = await Song.findByIdAndUpdate(id, updateData, { upsert: true, new: false, useFindAndModify: false });
      return song;
    },

    deleteSong: async (parent, args) => {
      const song = await Song.findByIdAndDelete(args.id);
      return song;
    },

    createPlaylist: async (parent, args) => {
      const playlist = new Playlist(args);
      await playlist.save();
      return playlist;
    },

    updatePlaylist: async (parent, args) => {
      const { id, ...updateData } = args;
      const playlist = await Playlist.findByIdAndUpdate(id, updateData, { upsert: true, new: false, useFindAndModify: false });
      return playlist;
    },

    deletePlaylist: async (parent, args) => {
      const playlist = await Playlist.findByIdAndDelete(args.id);
      return playlist;
    },

    addSongIdInPlaylist: async (parent, args) => {
      const { id, song_ids } = args;
      const playlist = await Playlist.findByIdAndUpdate(
        id,
        { $push: { song_ids: song_ids } },
        { upsert: true, new: false, useFindAndModify: false }
      );
      return playlist;
    },

    deleteSongIdInPlaylist: async (parent, args) => {
      const { id, song_ids } = args;
      const playlist = await Playlist.findByIdAndUpdate(
        id,
        { $pull: { song_ids: song_ids } },
        { upsert: true, new: false, useFindAndModify: false }
      );
      return playlist;
    },
  },

  Playlist: {
    song_ids: async (playlist, args, context) => {
      const { songLoader } = context.loaders;
      return await songLoader.loadMany(playlist.song_ids);
    },
  },
};

module.exports = resolvers;
