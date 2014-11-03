var express = require('express');
var router = express.Router();
var models = require('../mongoose/SimPoll-data-mongoose');
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
    var Flags = models.Flags;
    //Look into function for flags
    var flags= Flag.inView(req.latl, req.latr, req.longb, req.longt), function(err, result){
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            utils.sendSuccessResponse(res, {
                documents: result
            });
        }
    });
});