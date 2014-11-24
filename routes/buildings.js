var express = require('express');
var router = express.Router();
var Building = require('../models/building.js');
var Floorplan = require('../models/floorplan.js');
var utils = require('../utils/utils');
var fs = require('fs');
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
    console.log('id: ' + req.params.id);
    Building.findOne({ _id: req.params.id }, function(err, buildings) {
        console.log(buildings);
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
    var buildingsQuery = Buildings.find({"_id": req.id}).populate({path: 'floors', match: {number: req.floor}});
    buildingsQuery.exec(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            utils.sendSuccessResponse(res, { documents: docs });
        }
    });
});

router.post('/', function (req, res) {
    var building = new Building({
      "name": req.body.name,
      "floorplans": []
    });

    building.save(function (err, docs) {
        if (err) {
            utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
            utils.sendSuccessResponse(res, docs.id);
        }
    });
    console.log("building saved");
});

router.post('/:id', function (req, res){
  var floorplan = new Floorplan({
    "number": req.body.number,
    "description": req.body.description
  });

  console.log("floorplan made")

  floorplan.image.data = fs.readFileSync(req.body.image);
  floorplan.image.contentType = 'image/jpeg';

  console.log("floorplan image");

  floorplan.save(function (err, doc){
    if (err) {
      utils.sendErrResponse(res, 500, 'An unknown error occurred.');
    } else {
      Building.findOneAndUpdate({
        "_id": req.id
      }, {
        $push: {
          floorplans: doc._id
        }
      }, function (error, document) {
        if (error) {
          utils.sendErrResponse(res, 500, 'An unknown error occurred.');
        } else {
          utils.sendSuccessResponse(res);
        }
      });
    }
  });
      console.log("floorplan saved");
});

router.delete('/:id', function (req, res) {
    var Buildings = models.Buildings;
    Buildings.remove({
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

