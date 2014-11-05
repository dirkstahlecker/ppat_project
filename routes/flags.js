var express = require('express');
var router = express.Router();
var Flag = require('../models/flag.js');
var utils = require('../utils/utils');
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
    console.log('in flags get route ----------------');

    var flag = new Flag();

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

module.exports = router;