const express = require('express');
const traktApi = require('../api/trakt');
const router = express.Router();
const MovieModel = require('../models/MovieModel');
const HistoryModel = require('../models/HistoryModel');
const jwt = require('../middlewares/jwt');
const to = require('await-to-js').default;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Long = require('mongodb').Long;

router.get('/', jwt, async function(req, res) {
  const { user } = req;
  const match = {};
  const { query } = req;
  const { page, pageSize, orderBy, orderDirection, search } = query;
  const order = orderDirection === 'asc' ? 1 : -1;

  const aggregateSet = [
    {
			$match: {
				entityType: 1,
				user: user._id
			}
    },
    {
      $lookup: {
        // join
        from: 'movies',
        localField: 'entity',
        foreignField: '_id',
        as: 'movie'
      }
    },
    {
      $match: {
        $or: [
          { 'movie.title': new RegExp(search, 'i') },
          { watched_at: new RegExp(search, 'i') }
        ],
      }
    }, // match, search
    { $unwind: '$movie' }, // movie is returned as array, so unwind makes it normal obj
    {
      $group: {
        _id: '$movie.title',
        title: { $first: '$movie.title' },
        watched_at: { $first: '$watched_at' },
        movie: { $first: '$movie' }
      }
    },
    {
      $project: {
        // select only some fields
        _id: 1,
        watched_at: 1,
        movie: 1
      }
    }
  ];

  let orderSet = {};
  if (orderBy) {
		const orderByParsed = JSON.parse(orderBy);
    orderSet = {
      ...orderSet,
      $sort: {
        [orderByParsed.field]: order
      }
    };
  } else {
    orderSet = {
      ...orderSet,
      $sort: {
        watched_at: -1
      }
    };
  }

  aggregateSet.push(orderSet);

  try {
    const [errD, allData] = await to(
      HistoryModel.aggregate(aggregateSet)
        .facet({
          results: [
            { $skip: parseInt(page * pageSize) },
            { $limit: parseInt(pageSize) }
          ],
          count: [
            {
              $count: 'count'
            }
          ]
        })
        .addFields({
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0]
          }
        })
    );

    if (errD) {
      console.error(errD);
      res.status(500).send();
    }

    return res.json(allData[0]);
  } catch (error) {
    console.error('historyRoutes', error);
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
        res.send(400, e);
        return;
      }
    }

    if (response.data) {
      const { data } = response;
      if(!data.length) res.response(204);

      const newData = [];
      for (const history of data) {
				const longTraktId = Long(`${history.id}`); //casting to long cause mongo treats this as double defaultly
        let [errH, foundHistory] = await to(
          HistoryModel.find({ traktId: longTraktId, entityType: 1 })
        );
        if (errH) console.error('errH', errH);
        if (foundHistory && foundHistory.length > 0) continue;
        const { movie, id, ...restHistory } = history;
        let [errM, foundMovie] = await to(
          MovieModel.find({ 'ids.trakt': movie.ids.trakt })
        );
        if (errM) console.error('errM', errM);
        let movieId = foundMovie.length && foundMovie[0]._id;

        if (!foundMovie.length) {
          let newMovie = new MovieModel({ ...movie });
          let [errSM, savedMovie] = await to(newMovie.save());
          if (errSM) console.error('errSM', errSM);
          movieId = savedMovie._id;
        }

        const newHistory = new HistoryModel({
          ...restHistory,
          entity: movieId,
          traktId: longTraktId,
          entityType: 1,
          user: user._id
        });

        let [errNH, savedHistory] = await to(newHistory.save());
        if (errNH) console.error('errNH', errNH);
        newData.push(savedHistory);
      }
      res.status(200).send(newData);
    }
  }

  const [errorH, historyFind] = await to(
    HistoryModel.findOne({ user: user._id, entityType: 1 }).sort({
      watched_at: -1
    })
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
            { $match: { $expr: { $eq: ['$entity', '$$movie_id'] } } },
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
