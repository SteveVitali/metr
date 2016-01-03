var _ = require('lodash');
var async = require('async');
var request = require('request');
var ParkingSpace = require('../../models').ParkingSpace;
var m2x = require('../m2x-controller');

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

function createDevice(name, callback) {
  const url = 'https://api-m2x.att.com/v2/devices';
  var data = {
    name: name,
    description: '',
    visibility: 'private'
  };
  var opts = {
    method: 'POST',
    json: data,
    url: url,
    headers: {
      'X-M2X-KEY': m2x.key
    }
  };
  return request(opts, function(err, response, body) {
    callback(err, response, body);
  });
};

const m2xStreamOpts = {
  method: 'PUT',
  json: {
    unit: {
      label: 'Centimeter',
      symbol: 'cm'
    }
  },
  headers: {
    'X-M2X-KEY': m2x.key
  }
};

const m2xTriggerOpts = {
  method: 'POST',
  json: {
    name: 'prox-trigger',
    conditions: {
      'prox': { 'gte' : 0 }
    },
    frequency: 'continuous',
    callback_url: 'https://27d7fb80.ngrok.com/m2x-update',
    status: 'enabled',
    send_location: 'true'
  },
  headers: {
    'X-M2X-KEY': m2x.key
  }
};

exports.create = function(req, res) {
  //Invoked whenever a device is registered with the service.
  var tasks = [
    function(callback) {
      createDevice('placeholder', callback);
    },
    function(result, body, callback) {
      var space = _.extend(req.body, {
        deviceID: body.id
      });
      ParkingSpace.create(space, function(err, space) {
        if (err) return callback(err);

        var opts = m2xStreamOpts;
        opts.url = `https://api-m2x.att.com/v2/devices/${body.id}/streams/prox`;

        return request(m2xStreamOpts, function(err, result, bodyp) {
          callback(err, {
            // result: result,
            streamURL: bodyp.url,
            deviceID: body.id
          });
        });
      });
    },
    function(data, callback) {
      var opts = m2xTriggerOpts;
      opts.url = `https://api-m2x.att.com/v2/devices/${data.deviceID}/triggers`;
      return request(m2xTriggerOpts, function(err, result, data) {
        callback(err, data);
      });
    }
  ];

  async.waterfall(tasks, function(err, data) {
    if (err) return onErr(err);
    res.json(data);
  });
};

exports.getAll = function(req, res) {
  ParkingSpace.find({})
  .exec(function(err, spaces) {
    if (err) return onErr(err, res);
    res.send(spaces);
  });
};

exports.getParkingSaturation = function(req, res) {
  ParkingSpace
  .find({})
  .exec(function(err, spaces) {
    if (err) return onErr(err, res);
    var numAvailable = spaces.filter(function(space) {
      return space.isAvailable;
    }).length;
    var saturation = numAvailable / spaces.length * 100;
    res.send(saturation);
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
