var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var episodeSchema = new Schema({
  title: { type: String, required: true },
  season: { type: Number, required: true },
  number: { type: Number, required: true },
});

var ShowModel = new Schema(
  {
    title: { type: String, required: true },
    year: { type: Number, required: false },
    ids: {
      trakt: { type: Number, required: false },
      slug: { type: String, required: false },
      tvdb: { type: Number, required: false },
      imdb: { type: String, required: false },
      tmdb: { type: Number, required: false },
      tvrage: { type: String, required: false }
    },
    episodes: [episodeSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', ShowModel);
