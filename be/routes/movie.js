const express = require('express');
const auth = require('./auth');
const traktApi = require('../api/trakt');
const router = express.Router();
const MovieModel = require('../models/MovieModel');
const HistoryModel = require('../models/HistoryModel');
const jwt = require('../middlewares/jwt');
const to = require('await-to-js').default;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.get('/', jwt, function(req, res) {});

router.get('/:id', jwt, async function(req, res) {
  const { params } = req;
  const { id } = params;
  const { user } = req;

  const [errMovie, movie] = await to(
    MovieModel.aggregate([
      {
        $match: {
          _id: ObjectId(id)
        }
      },
      {
        $lookup: {
          from: 'histories',
          let: { movie_id: '$_id' },
          as: 'histories',
          pipeline: [
						{ "$match": { "$expr": { "$eq": ["$movie", "$$movie_id"] }}},
            { $sort: { watched_at: -1 } }
          ]
        }
      },
      {
        $match: {
          'histories.user': user._id
        }
      },
      {
        $sort: {
          'histories.watched_at': -1
        }
      }
    ])
  );

  if (errMovie) {
    res.send(400, errMovie);
  }
  if (movie.length > 0) {
    res.json(movie[0]);
  } else {
    res.send(404);
  }
});

module.exports = router;
