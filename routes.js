var express = require('express');
var router = express.Router();
var user = require('./controllers/user');

var isLoggedIn = function(req) {
  return !!(req.session && req.session.user);
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
    res.render('index', {
      user: req.session.user || null
    });
  });

  app.post('/login', user.login);
  app.post('/logout', user.logout);
  app.post('/signup', user.signup);
};
