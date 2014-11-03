var express = require('express');
var router = express.Router();
var models = require('../mongoose/SimPoll-data-mongoose');
var utils = require('../utils/utils');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
  Gets all buildings which are held in the system.

  This API endpoint may only be called with an existing user being logged in.

  GET /buildings/:id
  Request body:
    - No body
  Response:
    - success: building listings
    - err: on error, an error message
*/
router.get('/:id', function (req, res) {
    var Buildings = models.Buildings;
    var buildingsQuery = Buildings.find({"_id" = req.id});
    buildingsQuery.exec(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            utils.sendSuccessResponse(res, {
                documents: docs
            });
        }
    });
});

/*
  Gets all s particular floor of a building.

  This API endpoint may only be called with an existing user being logged in.

  GET /buildings/:id/:floor
  Request body:
    - No body
  Response:
    - success: floor listings
    - err: on error, an error message
*/
router.get('/:id/:floor', function (req, res) {
    var Buildings = models.Buildings;
    var buildingsQuery = Buildings.find({"_id" = req.id}).populate({path: 'floors', match: {number: req.floor}});
    buildingsQuery.exec(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            utils.sendSuccessResponse(res, {
                documents: docs
            });
        }
    });
});