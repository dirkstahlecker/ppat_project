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
            console.log('sending success response'); 
            //utils.sendSuccessResponse(res, {documents: result});
            res.send({documents: result});
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
    });

    console.log('flag to post:');
    console.log(flag);

    /* //TODO: put back in
    if (req.body.image != undefined) {
    	flag.image.data = fs.readFileSync(req.body.image);
    	flag.image.contentType = 'image/jpg';
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
    var Flags = models.Flags;
    Flags.remove({
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