var request = require('request');
var ParkingSpace = require('../models').ParkingSpace;

exports.occupy = function(req, res) {
  // Triggered whenever a device sensor status goes from 0-1.
  // 1. Corresponding parking space in the database is set to reserved
  // from the given timestamp.
  ParkingSpace.findById(req.params.id, function(err, space) {
    if (err) return onErr(err, res);
    // TODO handling for trying to reserve an already taken space?
    space.isAvailable = false;
    space.occupiedBy = req.user && req.user._id;
    space.occupiedAt = new Date();
    req.user.currentSpace = space._id;
    space.save(function(err) {
      if (err) return onErr(err, res);
      req.user.save(function(err) {
        if (err) return onErr(err, res);
        res.send('Success');
      });
    });
  });
};

exports.leave = function(req, res) {
  if (!req.user.currentSpace) return onErr('Not parked');
  ParkingSpace.findById(req.user.currentSpace, function(err, space) {
    req.user.currentSpace = undefined;
    space.occupiedBy = undefined;
    space.isAvailable = true;
    var occupiedAt = new Date(space.occupiedAt);
    var hours = Math.abs(now - occupiedAt) / 36e5;
    space.save(function(err) {
      if (err) return onErr(err, res);
      req.user.save(function(err) {
        if (err) return onErr(err, res);
        res.send({
          cost: hours * space.hourlyRate
        });
      });
    });
  });
};
