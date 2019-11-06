var express = require('express');
var auth = require('./auth');
var traktApi = require('../api/trakt');
var router = express.Router();
const MovieModel = require('../models/MovieModel');
const HistoryModel = require('../models/HistoryModel');
const jwt = require('../middlewares/jwt');
const to = require('await-to-js').default;

router.get('/', jwt, async function(req, res) {
  const { user } = req;
  const match = {};
  const { query } = req;
  const { page, pageSize } = query;

  if (query.search) {
    match.title = query.search;
  }

  try {
    const [errD, allData] = await to(
      /*      HistoryModel.find({ user: user._id })
        .populate({
          path: 'movie',
          match
        })
				.limit(parseInt(pageSize || 1))
        .skip(parseInt(page * pageSize))
        .sort({ watched_at: -1 })   */

      HistoryModel.aggregate([
        {
          $lookup: {
            from: 'movies',
            localField: 'movie',
            foreignField: '_id',
            as: 'movie'
          }
        },
        { $match: { 'movie.title': new RegExp(match.title, "") } },
				{ $skip: parseInt(page * pageSize) },
				{ $limit: parseInt(pageSize) },
				{ $unwind : "$movie" }
      ])


    );
    if (errD) {
      console.error(errD);
      res.status(500).send();
    }
    return res.json(allData);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/sync', jwt, async function(req, res) {
  const { user } = req;

  async function fetch(params = {}) {
    let response;
    try {
      response = await traktApi.get('sync/history/movies', {
        headers: {
          Authorization: `Bearer ${req.user.trakt.access_token}`
        },
        params
      });
    } catch (e) {
      if (e) {
        res.response(400, e);
        return;
      }
    }

    if (response.data) {
      const { data } = response;
      //if(!data.length) res.response(204);
      const newData = data.map(async history => {
        const { movie, ...restHistory } = history;
        let [errM, foundMovie] = await to(MovieModel.find({ ids: movie.ids }));
        let movieId = foundMovie.length && foundMovie[0]._id;

        if (!foundMovie.length) {
          let newMovie = new MovieModel({ ...movie });
          let [errSM, savedMovie] = await to(newMovie.save());
          movieId = savedMovie._id;
        }

        const newHistory = new HistoryModel({
          ...restHistory,
          movie: movieId,
          user: user._id
        });

        let [errNH, savedHistory] = await to(newHistory.save());
        //return savedHistory;
      });

      Promise.all(newData).then(async resp => {
        const [errD, allData] = await to(
          HistoryModel.find({ user: user._id }).sort({ watched_at: -1 })
        );
        return res.json(allData);
      });
    }
  }

  const [errorH, historyFind] = await to(
    HistoryModel.findOne({ user: user._id }).sort({ watched_at: -1 })
  );

  const params = {};
  console.log(historyFind);

  if (historyFind) {
    params.start_at = historyFind.watched_at;
    fetch(params);
  } else {
    //  initial fetch
    traktApi
      .get('sync/history/movies', {
        headers: {
          Authorization: `Bearer ${req.user.trakt.access_token}`
        },
        params: {
          limit: 1
        }
      })
      .then(iRes => {
        const { headers } = iRes;
        const countIntems =
          headers['X-Pagination-Item-Count'] ||
          headers['x-pagination-item-count'];
        fetch({ ...params, limit: countIntems });
      });
  }
});

module.exports = router;
