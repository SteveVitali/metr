var express = require('express');
var passport = require('passport');
var router = express.Router();
var user = require('./controllers/user');
var User = require('./models/user');

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
};
