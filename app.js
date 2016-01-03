var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var config = require('./config');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Set path to favicon.ico
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 's35510NZ3Kr17' }));
app.use(passport.initialize());
app.use(passport.session());

// Expose public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mongoose
mongoose.connect(config.MONGO_URL);

// Initialize routes
require('./routes')(app);

// Catch and forward errors to error handler
// (this executes if no previous route matches the URL)
app.use('*', function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling middleware.
// Only print whole error in development
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development' ? err : {})
  });
});

// m2x post trigger - david
app.post("/m2x-update", function (req, res) {
  console.log("m2x data received");
  var sensorData = req.body.values;
  console.log(sensorData);
});

module.exports = app;
