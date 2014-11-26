var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var EJS = require('ejs');
var fs = require('fs');
var Building = require('../models/building');
var Floorplan = require('../models/floorplan');
var async = require('async');


function renderEJS(url, data) {
	var html = "";
	try {
		var templateString = null;
		fs.readFile('test.ejs', 'utf-8', function(err, data) {
		    if(!err) {
		    	console.log('data after reading file');
		    	console.log(data);
		        templateString = data;
		        html = EJS.render(templateString);
		        return html;
		    }
		});
		

		//html = new EJS({url:'/Users/Dirk/MIT/5th_Semester/6.811/repo/ppat_project/views/test.ejs'}).render();
		//it thinks EJS is a function
	}
	catch (err) {
		console.log('err in renderEJS: ' + err);
	}
	
	//return html;
}


function compareFloorplans(a,b) {
	if (a.number > b.number) {
		return 1;
	}
	else if (a.number < b.number) {
		return -1;
	}
	return 0
}


/*
  Renders an ejs template

  POST /templates/renderbuilding
  Request body:
    - building: an object to be passed into the ejs template
  Response:
    - success: rendered html
    - err: an error message
*/
router.post('/renderbuilding', function (req,res) {
	var dir = __dirname.split('/routes');

	var building = req.body;

	var url = dir[0] + req.body.url;
	//console.log('building from server: ');
	//console.log(building);

	Building.findById(building.id).populate('floorplans').exec(function (err,building) {

		//console.log('before sorting floorplans');
		//console.log(building.floorplans);
		building.floorplans = building.floorplans.sort(compareFloorplans);
		//console.log('sorted floorplans:');
		//console.log(building.floorplans);

		fs.readFile(url, 'utf-8', function(err, template) {
		    if(!err) {
		        templateString = template;
		        html = EJS.render(templateString, {building: building});
		        //console.log('rendered html: ');
		        //console.log(html);
		        res.send({html:html});
		    }
		    else {
		    	console.log('Error in reading file: ' + err);
		    }
		});
		
		/*
		var floorplans = [];
		//console.log('building.floorplans:');
		//console.log(building.floorplans);
		var plansInBuilding = building.floorplans;
		Floorplan.find({}, function (err, floorplans) {
			//finds all floorplans
			console.log('all floorplans:');
			console.log(floorplans);
			for (var i = 0; i < floorplans.length; i++) {
				var plan = floorplans[i];
				if (jQuery.inArray(plan._id, plansInBuilding) != -1) {
					console.log('found!');
				}
			}
		});*/
		/*
		async.eachSeries(building.floorplans,
			function(floorplanID, callback) {
				console.log('floorplanID in each');
				console.log(floorplanID);
				console.log('err');
				console.log(err);
				Floorplan.findOne({_id: floorplanID}, function(err, found_plan) {
					console.log('pushing this floorplan: ');
					console.log(found_plan);
					floorplans.push(found_plan);
					//callback();
				});
			},
			function(err) { //callback
				console.log('in async callback');
				var html = "";
				var templateString = null;
				building.floorplans = floorplans;
				//console.log('building after manually adding floorplans');
				//console.log(building);
				fs.readFile(url, 'utf-8', function(err, template) {
				    if(!err) {
				        templateString = template;
				        html = EJS.render(templateString, {building: building});
				        res.send({html:html});
				    }
				    else {
				    	console.log('Error in reading file: ' + err);
				    }
				});
			}
		);*/
	});
});

/*
  Renders an ejs template

  POST /templates/render
  Request body:
    - data: data to render
  Response:
    - success: rendered html
    - err: an error message
*/
router.post('/render', function (req,res) {
	var data = req.body;

	var dir = __dirname.split('/routes');
	var url = dir[0] + req.body.url;
	console.log(url);

	var html = "";
	var templateString = null;
	fs.readFile(url, 'utf-8', function(err, template) {
	    if(!err) {
	        templateString = template;
	        html = EJS.render(templateString, {data: data});
	        res.send({html:html});
	    }
	});
});



module.exports = router;