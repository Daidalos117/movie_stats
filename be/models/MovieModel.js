var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovieSchema = new Schema(
  {
    /*	user: { type: Schema.ObjectId, ref: "User", required: true },*/
    title: { type: String, required: true },
    year: { type: Number, required: false },
    ids: {
      trakt: { type: Number, required: false },
      slug: { type: String, required: false },
      imdb: { type: String, required: false },
      tmdb: { type: Number, required: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', MovieSchema);
