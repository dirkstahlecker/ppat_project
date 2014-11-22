var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var EJS = require('ejs');
var fs = require('fs');
var Building = require('../models/building');
var floorplan = require('../models/floorplan');


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
	console.log(url);
	//html = new EJS({url:url});
	//var html = EJS.render(url,req.body.data);
	console.log('building from server: ');
	console.log(building);

	Building.findOne({_id: building.id})/*.populate('floorplans')*/.exec(function (err,building) {
		console.log('populated building');
		console.log(building);
		try {
			var html = "";
			var templateString = null;
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
		catch (err) {
			console.log(err);
		}
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
	console.log('in render: ');
	console.log(req.body);

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