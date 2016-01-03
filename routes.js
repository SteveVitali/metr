var express = require('express');
var passport = require('passport');
var request = require('request');
var router = express.Router();
var user = require('./controllers/user');
var User = require('./models/user');
var m2x = require('./controllers/m2x-controller');
var api = require('./controllers/api');
var parkingSpace = require('./controllers/parking-space');
var whitePages = require('./controllers/white-pages');

var isLoggedIn = function(req) {
  return !!req.user;
};

// Middleware that redirects a route to '/'
// if the user is not logged in.
var loggedIn = function(req, res, next) {
  if (isLoggedIn(req)) {
    return next();
  }
  res.redirect('/');
};

module.exports = function(app) {
  app.get('/', function(req, res) {
    if (!isLoggedIn(req)) {
      return res.redirect('/login');
    }
    res.render('index', {
      user: req.user
    });
  });

  app.get('/signup', function(req, res) {
    res.render('signup', {});
  });

  app.post('/signup', function(req, res) {
    var account = new User({ email: req.body.username });
    var password = req.body.password;
    User.register(account, password, function(err, account) {
      if (err) {
        console.log(err);
        return res.render('signup', { account: account });
      }
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    });
  });

  app.get('/login', function(req, res) {
    res.render('login', { user: req.user });
  });

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/parking-space/leave', parkingSpace.leave);
  app.get('/parking-space/occupy/:id', parkingSpace.occupy);

  app.post('/white-pages/identity-check', loggedIn, whitePages.identityCheck);

  // JSON API endpoints
  app.get('/api/parking-spaces', api.ParkingSpace.getAll);
  app.get('/api/parking-spaces', api.ParkingSpace.findById);
  app.get('/api/parking-spaces/for-user/:id', api.ParkingSpace.ownedByUser);
  app.get('/api/parking-spaces/find/nearby', api.ParkingSpace.findNearby);
  app.get('/api/parking-spaces/find/nearby/available', api.ParkingSpace.findAvailableNearby);
  app.post('/api/parking-spaces', api.ParkingSpace.create);

  app.get('/api/users/:id', api.User.findById);
  app.get('/api/users/', api.User.getAll);
  app.get('/api/users/find-by/email', api.User.findByEmail);

  app.get('/api/trips/of-user/:id', api.Trip.getUserHistory);
  app.get('/api/trips/of-space/:id', api.Trip.getParkingSpaceHistory);

  // m2x post trigger - david
  app.post('/m2x-update', function(req, res) {
    console.log('m2x data received');
    var sensorData = req.body.values;;
    res.send(res.headers);
    console.log(sensorData);
  });

  app.get('/debug/devices', function(req, res) {
    m2x.list(function(err, data) {
      res.send(data);
    });
  });

  // m2x post trigger - david
  app.post('/m2x-update', function(req, res) {
    console.log('m2x data received');
    var sensorData = req.body.values;
    console.log(sensorData);
  });
};
