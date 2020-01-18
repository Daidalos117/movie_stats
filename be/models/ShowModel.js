var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EpisodeScheme = new Schema({
  title: { type: String, required: true },
  season: { type: Number, required: true },
  number: { type: Number, required: true },
  ids: {
		trakt: { type: Number, required: false },
		tvdb: { type: Number, required: false },
		imdb: { type: String, required: false },
		tmdb: { type: Number, required: false },
		tvrage: { type: String, required: false }
	},
});

var ShowScheme = new Schema(
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
    episodes: { type: [EpisodeScheme], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', ShowScheme);
