var express = require('express');

require('dotenv').config();

//var apiResponse = require('./helpers/apiResponse');

const Passport = require('passport-trakt');

var app = express();

//app.use('/', indexRouter);
//app.use('/api/', indexRouter);


const port = process.env.PORT || 8080;

app.listen(port, err => {
	if (err) throw err
	console.log(`> Ready on server http://localhost:${port}`)
})


// app.get('/', (req, res) => {
// 	res.send('ExpressJS server is online.')
// })

app.get('*', (req, res) => {
	res.send(`ExpressJS server is responding from ${req.url}`);
})




module.exports = app;
