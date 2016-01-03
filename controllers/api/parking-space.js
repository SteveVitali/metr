var ParkingSpace = require('../../models').ParkingSpace;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.getAll = function(req, res) {
  ParkingSpace.find({})
  .exec(function(err, spaces) {
    if (err) return onErr(err, res);
    res.send(spaces);
  });
};

exports.findById = function(req, res) {
  ParkingSpace.findById(req.params.id, function(err, space) {
    if (err) return onErr(err, res);
    res.send(space);
  });
};

exports.findAvailable = function(req, res) {
  ParkingSpace.findAvailable(function(err, spaces) {
    if (err) return onErr(err, res);
    res.send(spaces);
  });
};

exports.findNearby = function(req, res) {
  var lng = Number(req.query.lng);
  var lat = Number(req.query.lat);
  var miles = Number(req.query.miles);
  ParkingSpace.findNearby(lng, lat, miles, function(err, spaces) {
    if (err) return onErr(err, res);
    res.send(spaces);
  });
};

exports.findAvailableNearby = function(req, res) {
  var lng = Number(req.query.lng);
  var lat = Number(req.query.lat);
  var miles = Number(req.query.miles);

  ParkingSpace.findAvailableNearby(
    lng, lat, miles,
    function(err, spaces) {
      if (err) return onErr(err, res);
      res.send(spaces);
    }
  );
};

exports.ownedByUser = function(req, res) {
  ParkingSpace.ownedByUser(req.params.id, function(err, spaces) {
    if (err) return onErr(err);
    res.send(spaces);
  });
};
