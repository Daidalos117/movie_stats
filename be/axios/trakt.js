var axios = require('axios');

const instance = axios.create({
  baseURL: 'https://api.trakt.tv',
  timeout: 1000,
  headers: {
    'Content-type': 'application/json',
    'trakt-api-key': process.env.TRAKT_CLIENT_ID,
		"trakt-api-version": 2,
  }
});

instance.defaults.timeout = 10000;

module.exports = instance;
