var express = require('express');
var passport = require('passport');
var request = require('request');
var router = express.Router();
var user = require('./controllers/user');
var User = require('./models/user');
var m2x = require('./controllers/m2x-controller');
var api = require('./controllers/api');

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

  // JSON API endpoints
  app.get('/api/parking-spaces', api.ParkingSpace.getAll);
  app.get('/api/parking-spaces', api.ParkingSpace.findById);
  app.get('/api/users/:id', api.User.findById);
  app.get('/api/users/', api.User.getAll);
  app.get('/api/parking-spaces/by-user/:id', api.ParkingSpace.ownedByUser);

  // M2X DEVICE ROUTES
  app.post('/admin/device/register', function(req, res) {
    // Can test this endpoint with following command:
    // curl -i -X POST localhost:3000/admin/device/register -H
    // "Content-Type: application/json" -d '{ "name": "Sample Device",
    // "description": "test device", "visibility": "private"} '
    var url = 'https://api-m2x.att.com/v2/devices';
    console.log(req.body);
    var data = {
      name: req.body.name,
      description: req.body.description,
      visibility: req.body.visibility
    };
    var opts = {
      method: 'POST',
      json: data,
      url: url,
      headers: {
        'X-M2X-KEY': m2x.key
      }
    };
    request(opts, function(err, result, body) {
      res.send(res.headers);
    });
  });
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
