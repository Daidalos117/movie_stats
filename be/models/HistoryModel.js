var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HistorySchema = new Schema({
  watched_at: { type: String, required: true },
  movie: { type: Schema.ObjectId, ref: 'Movie', required: true },
  user: { type: Schema.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model("History", HistorySchema);
