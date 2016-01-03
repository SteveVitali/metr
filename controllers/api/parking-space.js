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

exports.getParkingSaturation = function (req, res) {
  ParkingSpace.find({})
  .exec(function(err, spaces) {
    if (err) return onErr(err, res);
    var numAvailable = spaces.filter(function (space) {
      return space.isAvailable;
    }).length;
    var saturation = numAvailable / spaces.length * 100;
    res.send(saturation)
  }
}

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
  var MAX_DIST_IN_METERS = 2000;
  var lon = req.query.lng;
  var lat = req.query.lat;

  ParkingSpace.findNearby(lon, lat, MAX_DIST_IN_METERS, function(err, spaces) {
    if (err) return onErr(err, res);
    res.send(spaces);
  });
};

exports.findAvailableNearby = function(req, res) {
  var MAX_DIST_IN_METERS = 2000;
  var lon = req.query.lng;
  var lat = req.query.lat;

  ParkingSpace.findAvailableNearby(
    lon, lat, MAX_DIST_IN_METERS,
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
