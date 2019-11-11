var express = require('express');
var auth = require('./auth');
var traktApi = require('../api/trakt');
var router = express.Router();
const MovieModel = require('../models/MovieModel');
const HistoryModel = require('../models/HistoryModel');
const jwt = require('../middlewares/jwt');
const to = require('await-to-js').default;

router.get('/', jwt, function(req, res) {});

router.get('/:id', jwt, async function(req, res) {
  const { params } = req;

  const [errMovie, movie] = await to(
    MovieModel.aggregate([{
      // join
      from: 'histories',
      localField: '_id',
      foreignField: 'movie',
      as: 'histories'
    }]).findOne({ _id: params.id })
  );

  if (errMovie) {
    res.send(400, errMovie);
  }
  res.json(movie);
});

module.exports = router;
