var express = require('express');
var router = express.Router();
var Flag = require('../models/flag.js');
var utils = require('../utils/utils');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
  Gets all flags which are held in the view.

  This API endpoint may only be called with an existing user being logged in.

  GET /flags/:latr/:latl/:longb/:longt
  Request body:
    - No body
  Response:
    - success: flag listings
    - err: on error, an error message
*/
router.get('/:latr/:latl/:longb/:longt', function (req, res) {
    Flag.inView(req.params.latl, req.params.latr, req.params.longb, req.params.longt, function(err, result){
        if (err) {
            console.log('error!');
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            //utils.sendSuccessResponse(res, {documents: result});
            res.send({documents: result});
        }
    });
});

router.get('/:lat/:lng', function (req,res) {
	console.log(req.params.lat);
	console.log(req.params.lng);
	Flag.findOne({latitude: req.params.lat, longitude: req.params.lng}, function(err,flag) {
		console.log(flag);
		if (err) {
			utils.sendErrResponse(res,500, 'Unknown database error');
		}
		else {
			res.send(flag);
		}
	});
});

router.post('/', function (req, res) {
    var flag = new Flag({
        "title": req.body.title,
        "description": req.body.description,
        "latitude": req.body.latitude,
        "longitude": req.body.longitude,
        "icon": req.body.icon,
        "image": req.body.image
    });

    // console.log('TESTING IMAGES:');
    // console.log('req.body.image:' + req.body.image);
   
    /*
    if (req.body.image != '') { //TODO: error handling
    	try {
			flag.image.data = fs.readFileSync(req.body.image);
			flag.image.contentType = 'image/jpg';   		
    	}
    	catch (err) {
    		console.log("ERROR in POST /flags with getting the image");
    	}
	}
	else {
		flag.image = null;
	}
    */


    flag.save(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            utils.sendSuccessResponse(res);
        }
    });
});


router.delete('/:id', function (req, res) {
	Flag.remove({_id: req.params.id}, function (err, doc) {
		if (err) {
			utils.sendErrResponse(res, 500, 'An unknown error occurred.');
		} else {
			utils.sendSuccessResponse(res);
		}
	});
});


module.exports = router;