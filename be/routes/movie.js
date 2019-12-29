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

router.get('/', jwt, async function(req, res) {
	const { user } = req;
	const match = {};
	const { query } = req;
	const { page, pageSize, orderBy, orderDirection, search } = query;
	const order = orderDirection === 'asc' ? 1 : -1;

	const aggregateSet = [
		{
			$lookup: {
				// join
				from: 'movies',
				localField: 'movie',
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
				user: user._id
			}
		}, // match, search
		{ $unwind: '$movie' }, // movie is returned as array, so unwind makes it normal obj
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
				[orderByObj.field]: order
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
