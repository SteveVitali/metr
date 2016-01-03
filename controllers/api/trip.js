var Trip = require('../../models').Trip;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.getUserHistory = function(req, res) {
  if (!req.params.id) return onErr('No user id', res);
  Trip.getUserHistory(req.params.id, function(err, trips) {
    if (err) return onErr(err);
    res.send(trips);
  });
};

exports.getParkingSpaceHistory = function(req, res) {
  if (!req.params.id) return onErr('No user id', res);
  Trip.getParkingSpaceHistory(req.params.id, function(err, trips) {
    if (err) return onErr(err);
    res.send(trips);
  });
};
