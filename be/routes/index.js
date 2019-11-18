var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
	console.log('here',' index router')
  //res.render('index', { title: 'Express' });
	res.json({ message: 'ahoj' })
});

module.exports = router;
