var express = require('express');
var auth = require('./auth');
var traktApi = require('../api/trakt');
var router = express.Router();
const MovieModel = require('../models/MovieModel');
const HistoryModel = require('../models/HistoryModel');
const jwt = require('../middlewares/jwt');
const to = require('await-to-js').default;


module.exports = router;
