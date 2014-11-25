var express = require('express');
var router = express.Router();
var Building = require('../models/building');
var Floorplan = require('../models/floorplan');
var utils = require('../utils/utils');
var mongoose = require('mongoose');
var fs = require('fs');

/*
  Gets all buildings which are held in the system.

  GET /buildings/
  Request body:
    - No body
  Response:
    - success: building listings
    - err: on error, an error message
*/
router.get('/', function (req, res) {
    //console.log('id: ' + req.params.id);
    Building.find({}, function(err, buildings) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            res.send({ documents: buildings });
        }
    });
});

/*
  Gets all buildings which are held in the system.
  GET /buildings/:id
  Request body:
    - No body
  Response:
    - success: building listings
    - err: on error, an error message
*/
router.get('/:id', function (req, res) {
    //console.log('id: ' + req.params.id);
    Building.findOne({ _id: req.params.id }, function(err, buildings) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            res.send({ documents: buildings });
        }
    });
});

/*
  Gets all particular floors of a building.

  GET /buildings/:id/:floor
  Request body:
    - No body
  Response:
    - success: floor listings
    - err: on error, an error message
*/
router.get('/:id/:floor', function (req, res) {
    var buildingsQuery = Building.find({"_id": req.params.id}).populate({path: 'floors', match: {number: req.floor}});
    console.log(buildingsQuery);

    buildingsQuery.exec(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            res.send({ documents: docs });
        }
    });
});


//takes a comma separated string of numbers and parse them out
//into an array, and returns the array
function parsePoints(points) {
	var strArray = points.split(',');
	var intArray = [];
	for (var i = 0; i < strArray.length; i++) {
		intArray.push(Number(strArray[i]));
	}
	return intArray;
}


/* Add new building

  POST /buildings
  Request body:
	- name
	- latitude
	- longitude
	- points: comma separated string of points for outlining the building
	//- points_circle: comma separated string of three numbers, (x,y) coordinates and radius
	- floorplans: objectID array 
	- image: image path
  Response:
	- success: building that was just added
	- err: error 500
 */
router.post('/', function (req, res) {
	var points = parsePoints(req.body.points);

	try {
		var image = {};
		image.data = fs.readFileSync(req.body.image);
		image.contentType = 'image/jpg';

		console.log('image in POST /buildings:');
		console.log(image);
	}
	catch (err) {
		console.log("ERROR with image in POST /buildings");
		console.log(err);
	}

	var building = new Building({
		"name": req.body.name,
		"latitude": req.body.latitude,
		"longitude": req.body.longitude,
		"points": points,
		"floorplans": req.body.floorplans,
		"image": image
	});

	console.log('building to be saved: ');
	console.log(building);

	building.save(function (err, docs) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			res.send({building: building});
		}
	});
	console.log("building saved");
});

/* Add floorplan to existing building
  
  POST /buildings/floorplan/:id
  Request:
  	- number: floor number
  	- description
  	- image: string filepath to image
  Response:
  	- success: success response
  	- error: error code 500
*/
router.post('/floorplan/:id', function (req, res) {
	console.log('in POST /buildings/floorplan/:id');
	var floorplan = new Floorplan({
		"number": req.body.number,
		"description": req.body.description
	});

	floorplan.image.data = fs.readFileSync(req.body.image);
	floorplan.image.contentType = 'image/jpeg';

	console.log("floorplan made");
	console.log(floorplan);

	floorplan.save(function (err, doc) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		}
		Building.findOneAndUpdate({"_id": req.params.id}, {
			$push: {
				floorplans: doc._id
			}
		}, function (error, building) {
			if (error) {
				utils.sendErrResponse(res, 500, 'An unknown error occurred.');
			} else {
				res.send({building: building});
			}
		});
	});
});

router.delete('/:id', function (req, res) {
	var Buildings = models.Buildings;
	Buildings.remove({
		"_id": req.id
	}).exec(function (err, doc) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			utils.sendSuccessResponse(res);
		}
	});
});

module.exports = router;
