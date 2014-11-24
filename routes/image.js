var express = require('express');
var router = express.Router();
var Building = require('../models/building');
var floorplan = require('../models/floorplan');
var fs = require('fs');


/*
  Retreives an image from the database associated with a building

  POST /templates/renderbuilding
  Request body:
    - None
  Response:
    - success: image buffer
    - err: an error message
*/
router.get('/building/:id', function (req,res) {
	var id = req.params.id;

	Building.findOne({_id: id}, 'image', function(err, building) {

		//console.log(imgRaw);
		console.log(building.image.data);
		var buf = building.image.data;
		console.log(buf);

		res.writeHead(200, {'Content-Type': 'image/jpg' });
		res.end(buf, 'binary'); //TODO: change to base64 if possible

	});
});

router.get('/:imgPath', function(req, res) {

	var imgPath = req.params.imgPath;
	Building.findOne({name: 'Fulton Hall'}, function(err,building) {
		building.image.data = fs.readFileSync(imgPath);
		building.image.contentType = 'image/jpeg';

		building.save(function (err) {
			if (err) {
				throw 'error';
			}
			//res.render('index', { title: 'Express' });
			res.send({});

		});	
	});



});



module.exports = router;