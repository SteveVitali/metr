var express = require('express');
var passport = require('passport');
var router = express.Router();
var user = require('./controllers/user');
var User = require('./models/user');
var m2x = require('./controllers/m2x-controller'); 

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
    console.log('rendering', req.user);
    res.render('index', {
      user: req.user
    });
  });

  app.get('/register', function(req, res) {
    res.render('register', {});
  });

  app.post('/register', function(req, res) {
    var account = new User({ email: req.body.username });
    var password = req.body.password;
    User.register(account, password, function(err, account) {
      if (err) {
        console.log(err);
        return res.render('register', { account: account });
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
    console.log('authenticated...', req.user);
    res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  /*
   * M2X DEVICE ROUTES
   */

  app.get('/debug/devices', function(req, res) {
    m2x.list(function(err, data) {
      res.send(data);
    });
  });

};
