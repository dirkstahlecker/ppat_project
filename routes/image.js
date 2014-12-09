var express = require('express');
var router = express.Router();
//var Building = require('../models/building');
var Floorplan = require('../models/floorplan');
var fs = require('fs');
var utils = require('../utils/utils');


/*
  Retreives an image from the database associated with a building

  POST /image/building/:id
  Request body:
    - None
  Response:
    - success: image buffer
    - err: an error message
*/
router.get('/floorplan/:id', function (req,res) {
	var id = req.params.id;

	Floorplan.findOne({_id: id}, 'image', function(err, floorplan) {
        if (err) {
            console.log('cannot locate floorplan');
            return res.sendErrResponse(res, 500, 'Error: cannot locate floorplan');
        }
        console.log('floorplan:');
        console.log(floorplan);
		var buf = floorplan.image.data;

		if (buf == null || buf == undefined || buf == "") {
            console.log('no image buffer available');
			utils.sendErrResponse(res, 500, 'Error: no image available');
		}
		else {
            console.log('sending image');
			res.writeHead(200, {'Content-Type': floorplan.image.contentType }); //floorplan.image.contentType
			res.end(buf, 'base64'); //TODO: change to base64 if possible
		}
	});
});


router.get('/placeholder', function (req,res) {
	var data = fs.readFileSync('/img/placeholder.jpg');
	var contentType = 'image/jpg';

	res.writeHead(200, {'Content-Type': 'image/jpg' });
	res.end(data, 'binary');
});

router.get('flag/:id', function (req,res) {
	var id = req.params.id;
	Flags.findOne({_id: id}, 'image', function(err, flag) {
		var buf = flag.image.data;
		if (buf == null || buf == undefined || buf == "") {
			utils.sendErrResponse(res, 500, 'Error: no image available');
		}
		else {
			res.writeHead(200, {'Content-Type': 'image/jpg' });
			res.end(buf, 'binary'); //TODO: change to base64 if possible
		}
	});
});


router.post('/upload', function (req, res) {
	console.log('in uploading route!');
	console.log(req.body);
	console.log(req.body.image);
	console.log(typeof req.body.image);
});

/*
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
*/


module.exports = router;