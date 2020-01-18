var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HistorySchema = new Schema(
  {
    watched_at: { type: String, required: true },
    entity: { type: Schema.ObjectId, ref: 'Movie', required: true },
		/*
     * 1 -> movie
     * 2 -> show
		 */
		entityType: { type: Number, required: true },
		/**
     * episode  -> null movie. Optimization for not searching show only by episodeId, so using entityId.
		 */
		episode: { type: Schema.ObjectId, ref: 'Show.episodes'},
    user: { type: Schema.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('History', HistorySchema);
