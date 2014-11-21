var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
var EJS = require('ejs');
var fs = require('fs');


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

  POST /templates/render
  Request body:
    - building: an object to be passed into the ejs template
    - url: url to ejs template
  Response:
    - success: rendered html
    - err: an error message
*/
router.post('/render', function (req,res) {
	var dir = __dirname.split('/routes');
	console.log(req.body);

	var building = req.body;

	var url = dir[0] + req.body.url;
	console.log(url);
	//html = new EJS({url:url});
	//var html = EJS.render(url,req.body.data);
	try {
		//var html = new EJS({url:'/Users/Dirk/MIT/5th_Semester/6.811/repo/ppat_project/views/test.ejs'}).render({building:req.body.data});
		//var html = renderEJS();
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

		console.log(html);
	}
	catch (err) {
		console.log(err);
	}

	//res.send({html: html});
	
});

router.get('/render', function (req,res) {
	console.log('in get render');
	try {
		res.render('/Users/Dirk/MIT/5th_Semester/6.811/repo/ppat_project/views/test.ejs', {});
		console.log('supposedly rendered successfully');
	}
	catch (err) {
		console.log(err);
	}
	
});

module.exports = router;