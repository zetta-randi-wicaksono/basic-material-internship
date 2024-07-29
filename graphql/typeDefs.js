const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type User {
    id: ID
    username: String
  }

  type Song {
    id: ID!
    title: String!
    artist: String!
    released: Date!
    genre: String!
    duration: Int!
    album: String!
    played: Boolean!
    playedAt: Date
  }

  type Playlist {
    id: ID!
    title: String!
    song_ids: [Song]
  }

  type Query {
    getSongs: [Song]
    getSongById(id: ID!): Song
    findSongs(title: String, artist: String, released: Date, genre: String, duration: Int, album: String): [Song]

    getPlaylists: [Playlist]
    getPlaylistById(id: ID!): Playlist
    findPlaylists(title: String, song_ids: ID): [Playlist]

    getUsers: [User]
    getUserById(id: ID!): User
  }

  type AuthPayload {
    token: String!
    user: User
  }

  input AuthInput {
    username: String!
    password: String!
  }

  type WebhookResponse {
    success: Boolean!
    message: String
  }

  type Mutation {
    forwardToWebhook(title: String!, song_ids: [ID]): WebhookResponse

    signup(input: AuthInput!): AuthPayload
    signin(input: AuthInput!): AuthPayload

    createSong(title: String!, artist: String!, released: Date!, genre: String!, duration: Int!, album: String!): Song
    updateSong(id: ID!, title: String, artist: String, released: Date, genre: String, duration: Int, album: String): Song
    deleteSong(id: ID!): Song

    createPlaylist(title: String!): Playlist
    updatePlaylist(id: ID!, title: String): Playlist
    deletePlaylist(id: ID!): Playlist

    addSongIdInPlaylist(id: ID!, song_ids: ID!): Playlist
    deleteSongIdInPlaylist(id: ID!, song_ids: ID!): Playlist
  }
`;

module.exports = typeDefs;
