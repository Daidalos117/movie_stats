const express = require('express');
const traktApi = require('../api/trakt');
const router = express.Router();
const ShowModel = require('../models/ShowModel');
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
        entityType: 2,
        user: user._id
      }
    },
    {
      $lookup: {
        // join
        from: 'shows',
        localField: 'entity',
        foreignField: '_id',
        as: 'show'
      }
    },
    {
      $match: {
        $or: [
          { 'show.title': new RegExp(search, 'i') },
          { watched_at: new RegExp(search, 'i') }
        ]
      }
    }, // match, search
    { $unwind: '$show' }, // movie is returned as array, so unwind makes it normal obj,
		{
			$group: {
				_id: '$show.title',
				title: { $first: '$show.title' },
				watched_at: { $last: '$watched_at' },
				show: { $first: '$show' }
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
      response = await traktApi.get('sync/history/episodes', {
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
      if (!data.length) res.response(204);

      let newDataCount = 0;
      for (const history of data) {
        const longTraktId = Long(`${history.id}`);
        let [errH, foundHistory] = await to(
          HistoryModel.find({ traktId: longTraktId, entityType: 2 })
        );
        if (errH) console.error('errH', errH);
        if (foundHistory && foundHistory.length > 0) {
          continue;
        }

        const { episode, show, id, ...restHistory } = history;
        let [errM, foundShow] = await to(
          ShowModel.find({ 'ids.trakt': show.ids.trakt })
        );
        if (errM) console.error('errM', errM);
        let showId = foundShow.length && foundShow[0]._id;
        let dbShow = foundShow[0];

        if (!foundShow.length) {
          let newShow = new ShowModel({ ...show });
          let [errSM, savedShow] = await to(newShow.save());
          if (errSM) console.error('errSM', errSM);
          showId = savedShow._id;
          dbShow = savedShow;
        }

        let dbEpisode = dbShow.episodes.find(function(dbEpisode) {
          if (dbEpisode.ids.trakt === episode.ids.trakt) {
            return episode;
          }
        });

        if (!dbEpisode) {
          let episodeId = ObjectId();
          dbEpisode = {
            _id: episodeId,
            ...episode
          };
          dbShow.episodes.push(dbEpisode);
          const [errUS, updatedShow] = await to(dbShow.save());
          if (errUS) console.error('errUS', errUS);
        }

        const newHistory = new HistoryModel({
          ...restHistory,
          entity: showId,
          entityType: 2,
          traktId: longTraktId,
          episode: dbEpisode._id,
          user: user._id
        });

        let [errNH, savedHistory] = await to(newHistory.save());
        if (errNH) console.error('errNH', errNH);
        newDataCount += 1;
      }
      return newDataCount;
    }
  }

  const [errorH, historyFind] = await to(
    HistoryModel.findOne({ user: user._id, entityType: 2 }).sort({
      watched_at: -1
    })
  );

  const params = {};

  if (historyFind) {
    params.start_at = historyFind.watched_at;
  }

  //  initial fetch
  traktApi
    .get('sync/history/episodes', {
      headers: {
        Authorization: `Bearer ${req.user.trakt.access_token}`
      },
      params: {
        limit: 1,
        ...params
      }
    })
    .then(iRes => {
      const { headers } = iRes;
      const countIntems =
        headers['X-Pagination-Item-Count'] ||
        headers['x-pagination-item-count'];
      const itemsPerPage = 100;
      const pages = Math.ceil(countIntems / itemsPerPage);

      let newData = [];
      for (let page = pages; page > 0; page--) {
        newData.push(fetch({ ...params, limit: itemsPerPage, page }));
      }

      Promise.all(newData).then(function(values) {
        const newDataCount = values.reduce(function(previous, current) {
          return previous + current;
        }, 0);
        res.status(200).send({
          newDataCount
        });
      });
    });
});

router.get('/:id', jwt, async function(req, res) {
  const { params } = req;
  const { id } = params;
  const { user } = req;

  const [errShow, show] = await to(
    ShowModel.aggregate([
      {
        $match: {
          _id: ObjectId(id)
        }
      },
      { $unwind: '$episodes' },

      {
        $lookup: {
          from: 'histories',
          let: { episode_id: '$episodes._id' },
          as: 'histories',
          pipeline: [
            { $match: { $expr: { $eq: ['$episode', '$$episode_id'] } } },
            { $sort: { watched_at: -1 } }
          ]
        }
      },

      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          year: { $first: '$year' },
          episodes: {
            $push: {
              _id: '$episodes._id',
              season: '$episodes.season',
              number: '$episodes.number',
              title: '$episodes.title',
              histories: '$histories'
            }
          }
        }
      }
    ])
  );

  if (errShow) {
    res.send(400, errShow);
  }
  if (show.length > 0) {
    res.json(show[0]);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
