var ParkingSpace = require('../../models').ParkingSpace;
var m2x = require('../m2x-controller');
var request = require('request');
var async = require('async');

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

// Use the M2X device id to identify the parking-space.
exports.findByDeviceID = function(req, res) {
  ParkingSpace.findByName(req.params.name, function(err, space) {
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

function createDevice(name, callback) {
  const url = 'https://api-m2x.att.com/v2/devices';
  var data = {
    name: name,
    description: '',
    visibility: 'private',
  };
  var opts = {
    method: 'POST',
    json: data,
    url: url,
    headers: {
      'X-M2X-KEY': m2x.key
    }
  };
  return request(opts, callback);
};

exports.createSpace = function(req, res) {
  //Invoked whenever a device is registered with the service.
  tasks = [

    function(callback) {
      createDevice(req.body.name, callback)
    },

    function(result, body, callback) {
      // console.log(body);

      ParkingSpace.create({
        deviceID: body.id,
        owner: req.params.ownerID,
        isAvailable: true,
        hourlyRate: req.hourlyRate,
        location: req.location
      }, (err, space) => {
        if (err) return callback(err);
        
        //Succeeded in
        const url = `https://api-m2x.att.com/v2/devices/${body.id}/streams/prox`;
        var data = {
          unit: { 
            label: 'Centimeter',
            symbol: 'cm'
          }
        },
        opts = {
            method: 'PUT',
            json: data,
            url: url,
            headers: {
              'X-M2X-KEY': m2x.key
            }
        };
        return request(opts, function(err, result, bodyp) {
          callback(null, {
            // result: result,
            streamURL: bodyp.url,
            deviceID: body.id
          });
        });
      });
    }
  ];

  async.waterfall(tasks, function(err, data) {
    if (err)
      return onErr(err);
    res.json(data);
  });
};

exports.occupySpace = function(req, res) {
  //Triggered whenever a device sensor status goes from 0-1.
  //1. Corresponding parking space in the database is set to reserved
  //from the given timestamp.

  ParkingSpace.findByDeviceID(req.params.name, function(err, space) {
    if (err) return onErr(err, res);    
    //TODO handling for trying to reserve an already taken space?

    space.isAvailable = false;
    space.save();
  });
};
