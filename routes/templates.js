var express = require('express');
var router = express.Router();
var utils = require('../utils/utils');
//var EJS = require('ejs');


function renderEJS(url, data) {
	var html = {};
	try {
		html = new ejs({url:'/Users/Dirk/MIT/5th_Semester/6.811/repo/ppat_project/views/test.ejs'}).render();
		//it thinks EJS is a functin
	}
	catch (err) {
		console.log('err in renderEJS: ' + err);
	}
	
	return html;
}


/*
  Renders an ejs template

  POST /templates/render
  Request body:
    - data: an object to be passed into the ejs template
    - url: url to ejs template
  Response:
    - success: rendered html
    - err: an error message
*/
router.post('/render', function (req,res) {
	var dir = __dirname.split('/routes');

	var url = dir[0] + req.body.url;
	console.log(url);
	//html = new EJS({url:url});
	//var html = EJS.render(url,req.body.data);
	try {
		//var html = new EJS({url:'/Users/Dirk/MIT/5th_Semester/6.811/repo/ppat_project/views/test.ejs'}).render({building:req.body.data});
		var html = renderEJS();
		console.log(html);
	}
	catch (err) {
		console.log(err);
	}

	res.send({html: html});
	
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