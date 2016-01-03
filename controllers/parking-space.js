var request = require('request');
var ParkingSpace = require('../models').ParkingSpace;
var User = require('../models').User;
var Trip = require('../models').Trip;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.occupy = function(req, res) {
  var userId = req.user ? req.user._id : req.query.userId;
  console.log('occupying', userId);
  if (!userId) return onErr('Invalid user', res);
  User.findById(userId, function(err, user) {
    if (err) return onErr(err, res);
    console.log('fetched user', user);
    // Triggered whenever a device sensor status goes from 0-1.
    // 1. Corresponding parking space in the database is set to reserved
    // from the given timestamp.
    ParkingSpace.findByDeviceId(req.params.id, function(err, space) {
      if (err || !space) return onErr(err || 'Invalid space', res);
      // TODO handling for trying to reserve an already taken space?
      console.log('fetched space', space);
      space.isAvailable = false;
      space.occupiedBy = user && user._id;
      space.occupiedAt = new Date();
      user.currentSpace = space._id;
      space.save(function(err) {
        if (err) return onErr(err, res);
        console.log('updated space', space);
        user.save(function(err) {
          if (err) return onErr(err, res);
          console.log('updated user', user);
          res.send('Success');
        });
      });
    });
  });
};

exports.occupyPost = function(req, res) {
  // Triggered whenever a device sensor status goes from 0-1.
  // 1. Corresponding parking space in the database is set to reserved
  // from the given timestamp.
  ParkingSpace.findByDeviceID(req.body.device.id, function(err, space) {
    if (err || !space) return onErr(err || 'Invalid space', res);
    // TODO handling for trying to reserve an already taken space?
    console.log(space);
    space.isAvailable = false;
    space.occupiedAt = new Date();
    space.save(function(err) {
      if (err) return onErr(err, res);
      console.log('updated space', space);
      res.send('Success');
    });
  });
};


exports.leave = function(req, res) {
  var userId = req.user ? req.user._id : req.query.userId;
  if (!userId) return onErr('Invalid user', res);
  User.findById(userId, function(err, user) {
    if (err || !user) return onErr(err, res);
    if (!user.currentSpace) return onErr('Not parked');
    ParkingSpace.findById(user.currentSpace, function(err, space) {
      if (err) return onErr(err);
      var oldSpace = user.currentSpace;
      user.currentSpace = undefined;
      space.occupiedBy = undefined;
      space.isAvailable = true;
      var occupiedAt = new Date(space.occupiedAt);
      var now = new Date();
      var hours = Math.abs(now - occupiedAt) / 36e5;
      space.save(function(err) {
        if (err) return onErr(err, res);
        user.save(function(err) {
          if (err) return onErr(err, res);
          var occupiedAt = new Date(space.occupiedAt);
          var now = new Date();
          var hours = Math.abs(now - occupiedAt) / 36e5;
          Trip.create({
            driver: userId,
            parkingSpace: oldSpace,
            startTime: occupiedAt,
            endTime: new Date(),
            hourlyRate: space.hourlyRate,
            cost: space.hourlyRate * hours
          }, function(err, trip) {
            if (err) return onErr(err);
            res.send(trip);
          });
        });
      });
    });
  });
};
