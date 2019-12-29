var express = require('express');
var auth = require('./auth');
var traktApi = require('../api/trakt');
var router = express.Router();
const MovieModel = require('../models/MovieModel');
const HistoryModel = require('../models/HistoryModel');
const jwt = require('../middlewares/jwt');
const to = require('await-to-js').default;


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
        res.send(400, e);
        return;
      }
    }

    if (response.data) {
      const { data } = response;
      //if(!data.length) res.response(204);
      const newData = data.map(async history => {
        let [errH, foundHistory] = await to(
          HistoryModel.find({ watched_at: history.watched_at })
        );

        if (foundHistory && foundHistory.length > 0) return;
        const { movie, ...restHistory } = history;
        let [errM, foundMovie] = await to(
          MovieModel.find({ 'ids.trakt': movie.ids.trakt })
        );
        let movieId = foundMovie.length && foundMovie[0]._id;

        if (!foundMovie.length) {
          let newMovie = new MovieModel({ ...movie });
          let [errSM, savedMovie] = await to(newMovie.save());
          movieId = savedMovie._id;
        }

        console.log(movie.title);
        console.table(foundMovie);

        const newHistory = new HistoryModel({
          ...restHistory,
          movie: movieId,
          user: user._id
        });

        let [errNH, savedHistory] = await to(newHistory.save());
        return savedHistory;
      });

      Promise.all(newData).then(() => {
        res.send(200, newData);
      });
    }
  }

  const [errorH, historyFind] = await to(
    HistoryModel.findOne({ user: user._id }).sort({ watched_at: -1 })
  );

  const params = {};

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
