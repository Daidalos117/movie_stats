var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var apiResponse = require('./helpers/apiResponse');
var cors = require('cors');
var passport = require('passport');
const UserModel = require('./models/UserModel');
const jwt = require('jsonwebtoken');

// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require('mongoose');
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', MONGODB_URL);
      console.log('App is running ... \n');
      console.log('Press CTRL + C to stop the process. \n');
    }
  })
  .catch(err => {
    console.error('App starting error:', err.message);
    process.exit(1);
  });
var db = mongoose.connection;

var app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport
app.use(passport.initialize());
app.use(passport.session());

//To allow cross-origin requests
app.use(cors());

// decode jwt into user
app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization) {
    const authorization = req.headers.authorization.split(' ')[1];
      let decoded;

    try {
      decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).send('unauthorized');
    }

    var userId = decoded.id;

    // Fetch the user by id
    UserModel.findById(userId).then(function(user, error) {
      // Do something with the user
      if (user) {
        req.user = user;
      }
    });
  } else {
    req.user = false;
  }

  next();
});

//Route Prefixes
app.use('/', indexRouter);
app.use('/api/', apiRouter);

// throw 404 if URL not found
app.all('*', function(req, res) {
  return apiResponse.notFoundResponse(res, 'Page not found');
});

app.use((err, req, res) => {
  if (err.name == 'UnauthorizedError') {
    return apiResponse.unauthorizedResponse(res, err.message);
  }
});

module.exports = app;
