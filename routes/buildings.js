var express = require('express');
var router = express.Router();
var Building = require('../models/building');
var Floorplan = require('../models/floorplan');
var utils = require('../utils/utils');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fs = require('fs');


//add java-like strip and lstrip functionality
if (typeof(String.prototype.strip) === "undefined") {
    String.prototype.strip = function() {
        return String(this).replace(/\s+$/g, '');
    };
}
if (typeof(String.prototype.lstrip) === "undefined") {
    String.prototype.lstrip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}


//add a floor to a building
router.get('/addfloor/:id', function (req, res) {
	//console.log('Adding floor route that renders the ejs');
	var id = req.params.id;

	Building.findOne({_id: id}, function (err, building) {
		res.render('addfloor.ejs', {building: building});
	});
});

//edit a building
router.get('/edit/:id', function (req,res) {
	var id = req.params.id;

	Building.findOne({_id: id}, function (err, building) {
		res.render('editbuilding.ejs', {building: building});
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
    //console.log('buildingsQuery: ');
    //console.log(buildingsQuery);

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
		image = "";
	}

	//console.log('body.floorplans:');
	//console.log(body.floorplans);

	var building = new Building({
		"name": body.name,
		"latitude": body.latitude,
		"longitude": body.longitude,
		"points": body.points,
		"floorplans": [],//body.floorplans//,
		"image": image
	});

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
	//console.log('BUILDING POST req.body');
	//console.log(req.body);

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
	var body = {};

	console.log('coords coming in:');
	console.log(req.body.coords);
	var re = new RegExp("[0-9\-\.]+,[0-9\-\.]+");
	var coords;
	try {
		coords = req.body.coords.match(re)[0].split(',');
		console.log('coords after:');
		console.log(coords);		
	}
	catch (err) {
		res.render('main.ejs', {error: "Error: Coordinates are required"});
		return;
	}


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
	body.floorplans = '';
	body.image = req.body.image;
	console.log('image path in buildings/form: ');
	console.log(body.image); 

	var points = req.body.points.split(',');
	if (points.length > 1) {
		body.points = parsePoints(req.body.points);
	}
	else {
		try {
			var radius = Number(req.body.points);
			radius /= 5000000; //TODO: kind of a hack (get an actual conversation factor)
			if (radius == NaN) {
				res.render('main.ejs', {error: "Error: Coordinates must only contain numbers and commas"});
			}
			console.log('radius: ' + radius);
			console.log('latitude - radius: ' + String(body.latitude - radius));
			body.points = [ 
				body.latitude - radius , body.longitude - radius,
				body.latitude + radius , body.longitude - radius,
				body.latitude + radius , body.longitude + radius,
				body.latitude - radius , body.longitude + radius
			];
		}
		catch (err) {
			res.render('main.ejs', {error: "Error: Coordinates must only contain numbers and commas"});
		}
	}

	console.log('body.points:');
	console.log(body.points);
	var building = addBuilding(body,res,true);
	console.log('returned building in form:');
	console.log(building);

	building.save(function (err, docs) {
		if (err) {
			console.log('saving building error');
			res.render('main.ejs', {error: "Error: Unknown error occurred"});
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

	var dscr = req.body.description;

	var re = new RegExp('\/\/');
	var segments = dscr.split(re);
	console.log('segments');
	console.log(segments);

	var description = "";
	for (var i = 0; i < segments.length; i++) {
		description += '<li>'
		description += segments[i];
		description += '</li>'
	}
	console.log('fixed description:');
	console.log(description);

	var floorplan = new Floorplan({
		"number": req.body.number,
		"description": description,
		"url": req.body.url
	});

	var error = null;
	try {
		if (req.body.image != "") {
			floorplan.image.data = fs.readFileSync(req.body.image);
			floorplan.image.contentType = 'image/jpeg';	
		}

	}
	catch (err) {
		floorplan.image = {};
		error = "Invalid image path";
		//TODO: alert the user somehow 
	}
	


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
					res.redirect('/');
				}
			});
		});		
	}
});

/* Edit an existing building
  
  POST /buildings/edit/:id
  Request:
  	- name: building name
  	- latLng: latitude and longitude, comma separated
  	- outline: center and radius or list of coordinates (comma separated)
  Response:
  	- success: success response
  	- error: error code 500
*/
router.post('/edit/:id', function (req,res) {
	var id = req.params.id;
	var name = req.body.name;
	
	var latitude = undefined;
	var longitude = undefined;
	var error = undefined;
	if (req.body.latLng != '') {
		try {
			var latLng = req.body.latLng.split(',');
			latitude = Number(latLng[0].strip().lstrip());
			longitude = Number(latLng[1].strip().lstrip());		
		}
		catch (err) {
			latitude = longitude = undefined;
			error = 'Invalid latitude and longitude';
		}
	}

	var points = req.body.outline;

	console.log('latitude:' + latitude);
	console.log('longitude:' + longitude);

	Building.findOne({_id: id}, function (err, building) {
		if (name != '') { building.name = name }
		if (latitude != undefined) { building.latitude = latitude }
		if (longitude != undefined) { building.longitude = longitude }
		if (points != '') {
			points = parsePoints(points);
			building.points = points;
		}
		building.save(function (err) {
			if (err) {
				res.render('main.ejs', {error: 'Unable to edit building'});
			}
			if (error) {
				res.render('main.ejs', {error: error});
			}
			res.render('main.ejs', {error: null});
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
