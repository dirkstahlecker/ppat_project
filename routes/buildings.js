var express = require('express');
var router = express.Router();
var Building = require('../models/building');
var utils = require('../utils/utils');
var mongoose = require('mongoose');

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
  Gets a specified building by id

  This API endpoint may only be called with an existing user being logged in.

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

  This API endpoint may only be called with an existing user being logged in.

  GET /buildings/:id/:floor
  Request body:
    - No body
  Response:
    - success: floor listings
    - err: on error, an error message
*/
router.get('/:id/:floor', function (req, res) {
    var buildingsQuery = Building.find({"_id": req.params.id}).populate({path: 'floors', match: {number: req.floor}});
    console.log(buildingsQuery);

    buildingsQuery.exec(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            res.send({ documents: docs });
        }
    });
});

module.exports = router;

