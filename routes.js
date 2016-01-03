var express = require('express');
var passport = require('passport');
var router = express.Router();
var http = require('http');

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

  /*
   * M2X DEVICE ROUTES
   */

  app.post('/admin/device/register', function(req, res) {
      //curl -i -X POST https://api-m2x.att.com/v2/devices -H "X-M2X-KEY: 7611hg8391k834829gkff640j8j990i2" -H "Content-Type: application/json" -d '{ "name": "Sample Device", "description": "My first device", "visibility": "public" }'
      //req.body
      var opts {
        host: 'https://api-m2x.att.com/v2/devices',
        method: 'POST',
        headers: {
          'X-M2X-KEY': m2x.key,
          'Content-Type': 'application/json'
        }
      };

      var data = JSON.stringify({
        name: req.body.name,
        description: req.body.description,
        visibility: req.body.visibility,
      });


  });

  app.get('/debug/devices', function(req, res) {
    m2x.list(function(err, data) {
      res.send(data);
    });
  });

};
