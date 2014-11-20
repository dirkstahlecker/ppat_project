var express = require('express');
var router = express.Router();
var fs = require('fs');
var ImageTesting = require('../models/imagetesting.js');
/*
router.get('/', function(req,res) {
	console.log
	res.sendFile('/userinterface/index.html');
});*/

/* GET home page. 
router.get('/', function(req, res) {

	var imgPath = '/users/dirk/downloads/jeffgordon.jpeg';
	var img = new ImageTesting({name: 'test' });

	img.image.data = fs.readFileSync(imgPath);
	img.image.contentType = 'image/jpeg';

	img.save(function (err) {
		if (err) {
			throw 'error';
		}
		res.render('index', { title: 'Express' });

	});

});

router.get('/getimage', function(req,res) {
	console.log('in get image');
	ImageTesting.findOne({ name: 'test' }, function(err, imgRaw) {
		//res.send(img);

		//console.log(imgRaw);
		console.log(imgRaw.image.data);
		var buf = imgRaw.image.data;
		console.log(buf);

		//var img = new Buffer(imgRaw.data, 'binary');

		res.writeHead(200, {'Content-Type': 'image/jpeg' });
		res.end(buf, 'binary'); //TODO: change to base64 if possible
	});	
});*/

module.exports = router;

