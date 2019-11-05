const express = require('express');
const { authenticate } = require('./auth');
const User = require('../models/UserModel');
const router = express.Router();

router.get('/', authenticate, function(req, res) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      res.status(400).send({ error: err });
      return;
    }
    res.json(user);
  });
});

router.post('/logout', authenticate, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = {
  router
};
