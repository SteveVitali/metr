var User = require('../../models').User;

var onErr = function(err, res) {
  err && console.log(err);
  res.status(500).send(err);
};

exports.getAll = function(req, res) {
  User.find({})
  .exec(function(err, users) {
    if (err) return onErr(err, res);
    res.send(users);
  });
};

exports.findById = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) return onErr(err, res);
    res.send(user);
  });
};

exports.findByEmail = function(req, res) {
  User.findByEmail(req.query.email, function(err, user) {
    if (err) return onErr(err, res);
    res.send(user);
  });
};
