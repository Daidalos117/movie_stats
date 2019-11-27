const express = require('express');
//const passport = require('passport');
const User = require('../models/UserModel');

//const router = express.Router();

//const TraktStrategy = PassportTrakt.Strategy;

/*
const TRAKT_CLIENT_ID =
  process.env.TRAKT_CLIENT_ID ||
  'ee3279e31508a0f5b6a0df475dbc5fa83ce234140c9d39549aa4f1119483b78a';
const TRAKT_CLIENT_SECRET =
  process.env.TRAKT_CLIENT_SECRET ||
  '5704b7df098511a0e01c491a9583ea52b06338e3f8834df906a4c188acab2bcf';

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Trakt profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user.trakt.id);
});

passport.deserializeUser(function(obj, done) {
  User.findOne({ 'trakt.id': obj.trakt.id || obj.id }, function(err, user) {
    done(null, user);
  });
});

// Use the TraktStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Trakt
//   profile), and invoke a callback with a user object.
passport.use(
  new TraktStrategy(
    {
      clientID: TRAKT_CLIENT_ID,
      clientSecret: TRAKT_CLIENT_SECRET,
      callbackURL: 'https://127.0.0.1:8080/api/auth/callback'
    },
    function(accessToken, refreshToken, params, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function() {
        User.findOne({ 'trakt.id': profile.id }, function(err, user) {
          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err) return done(err);

          // if the user is found then log them in
          if (user) {
            user.trakt.access_token = accessToken;
            user.trakt.refresh_token = refreshToken;

            user.save();

            return done(null, user); // user found, return that user
          } else {
            const newUser = new User();
            newUser.trakt.access_token = accessToken;
            newUser.trakt.refresh_token = refreshToken;

            // set all of the user data that we need
            newUser.trakt.id = profile.id;

            newUser.username = profile.username;
            newUser.trakt.vip = profile.vip;

            // save our user into the database
            newUser.save(function(err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/log');
}

// GET /auth/trakt
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Trakt authentication will involve redirecting
//   the user to trakt.tv.  After authorization, Trakt will redirect the user
//   back to this application at /auth/trakt/callback
router.get('/', passport.authenticate('trakt'), function(req, res) {
  // The request will be redirected to Trakt for authentication, so this
  // function will not be called.
});

// GET /auth/trakt/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  '/callback',
  passport.authenticate('trakt', { failureRedirect: '/login', session: false }),
  async function(req, res) {

		try {
			const token = await req.user.generateAuthToken();
			req.token = token;
		} catch(err) {
			console.log("There was an error")
			console.log(err)
		}

    res.redirect(`http://localhost:3000/loginCallback/${req.token}`);
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
*/

module.exports = {};
