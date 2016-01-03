var async = require('async');
var mongoose = require('mongoose');
var _ = require('underscore');
var User = require('../models/user');
var ParkingSpace = require('../models/parking-space');
var config = require('../config');

mongoose.connect(process.env.MONGO_URL || config.MONGO_URL);

var getRandomElement = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var userOptions = {
  email: [
    'svitali@seas.upenn.edu', 'dliao@seas.upenn.edu',
    'jcho@seas.upenn.edu', 'kmumick@seas.upenn.edu',
    '14stevevitali@gmail.com', 'ayy@lmao.com'
  ],
  firstName: ['Steve', 'Kieraj', 'JT', 'David', 'Ayy', 'Welp'],
  lastName: ['Vitali', 'Mumick', 'Cho', 'Liao', 'Lmao','Womp'],
  currentSpace: [null],
  spaces: [[]]
};

var randomObject = function(options) {
  return _.mapObject(options, function(val, key) {
    return getRandomElement(options[key]);
  });
};

var userIds = [];
async.times(6, function(n, next) {
  var user = new User(randomObject(userOptions));
  user.save(function(err) {
    err && console.log(err);
    console.log('created', user);

    userIds.push(user._id);
    next();
  });
},
function(err) {
  err && console.log(err);
  var spaceOptions = {
    owner: userIds,
    isAvailable: [true, false],
    occupiedBy: [null],
    hourlyRate: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    location: [
      [37.796239, -122.405177],
      [37.794004, -122.404725],
      [37.793082, -122.408647],
      [37.794015, -122.401276],
      [37.794257, -122.406321],
      [37.794862, -122.403208]
    ]
  };
  async.times(6, function(n, next) {
    ParkingSpace.create(randomObject(spaceOptions), function(err, space) {
      err && console.log(err);
      console.log('created', space);
      next();
    });
  },
  function(err) {
    err && console.log(err);
    console.log('Done');
    process.exit(1);
  });
});
