var express = require('express');
var router = express.Router();
var Building = require('../models/building');
var Floorplan = require('../models/floorplan');
var utils = require('../utils/utils');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');


router.get('/addfloor/:id', function (req, res) {
	console.log('Adding floor route that renders the ejs');
	var id = req.params.id;

	Building.findOne({_id: id}, function (err, building) {
		res.render('addfloor.ejs', {building: building});
	});
});

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
    console.log('buildingsQuery: ');
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







function addBuilding(body) {
	var image;
	try {
		image = {};
		image.data = fs.readFileSync(body.image);
		image.contentType = 'image/jpg';

		console.log('image in POST /buildings:');
		console.log(image);
	}
	catch (err) {
		console.log("ERROR with image in POST /buildings"); //TODO: alert user of invalid url
		console.log(err);
	}

	console.log('body.floorplans:');
	console.log(body.floorplans);

	var building = new Building({
		"name": body.name,
		"latitude": body.latitude,
		"longitude": body.longitude,
		"points": body.points,
		"floorplans": []//body.floorplans//,
		//"image": image
	});

	console.log('returning from addBuilding')

	return building;
}



/* Add new building from an ajax request

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
	console.log('BUILDING POST req.body');
	console.log(req.body);

	var body = req.body;
	body.points = parsePoints(req.body.points);

	var building = addBuilding(body,res,false);

	building.save(function (err, docs) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			res.send({building: building}); //ajax request; want to return data
		}
	});
});



//add a new building from the add.html form
router.post('/form', function(req,res) {
	console.log("SENDING BUILDING DATA TO FORM");
	console.log(req.body);
	var body = {};

	console.log('coords coming in:');
	console.log(req.body.coords);
	var re = new RegExp("[0-9\-\.]+,[0-9\-\.]+");
	var coords = req.body.coords.match(re)[0].split(',');
	console.log('coords after:');
	console.log(coords);

	try {
		body.latitude = Number(coords[0]);
		body.longitude = Number(coords[1]);
		console.log('latitude:' + body.latitude);
		console.log('longitude:' + body.longitude);	
	}
	catch (err) {
		console.log('ERROR in getting latitude and longitude');
		body.latitude = 0;
		body.longitude = 0;
	}

	body.name = req.body.buildingname;
	body.points = []; //TODO: this
	body.floorplans = '';
	body.image = req.body.image;

	console.log('form body sending to addBuilding:');
	console.log(body);

	var building = addBuilding(body,res,true);
	console.log('returned building in form:');
	console.log(building);

	building.save(function (err, docs) {
		if (err) {
			console.log('saving building error');
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			console.log('redirecting');
			res.redirect('/');
		}
	});
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

	var error = null;
	if (req.body.image != "") { //TODO: use regex to ignore spaces
		try {
			floorplan.image.data = fs.readFileSync(req.body.image);
			floorplan.image.contentType = 'image/jpeg';
		}
		catch (err) {
			floorplan.image = {};
			error = "Invalid image path";
			//TODO: alert the user somehow 
		}
	}

	console.log("floorplan made");
	console.log(floorplan);

	if (error != null) {
		res.render('main.ejs', {error: error});
	}
	else {
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
					res.render('main.ejs', {error: 'An unknown error occurred'});
				} else {
					res.render('main.ejs', {error: null});
				}
			});
		});		
	}
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
