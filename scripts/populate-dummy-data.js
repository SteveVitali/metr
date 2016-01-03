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
  firstName: [
    'Steve', 'Kieraj', 'JT', 'David', 'Ayy', 'Welp',
    'Charles', 'Charlie', 'Stephanie', 'Alex', 'John', 'Gary',
    'Wilhelm', 'Fred', 'Friedrich', 'Ernest', 'Immanuel', 'Hentry'
  ],
  lastName: [
    'Vitali', 'Mumick', 'Cho', 'Liao', 'Lmao','Womp',
    'Heisenberg', 'Nietzsche', 'Schiller', 'Kant', 'Rand', 'Grant',
    'Kissinger', 'Kennedy', 'Bush', 'Sanders', 'Clinton', 'Mongo'
  ]
};

var getObject = function(options, i) {
  return _.mapObject(options, function(value, key) {
    return value[i];
  });
};

var randomObject = function(options) {
  return _.mapObject(options, function(val, key) {
    return getRandomElement(options[key]);
  });
};

var userIds = [];
async.times(18, function(n, next) {
  var newUser = getObject(userOptions, n);
  newUser = _.extend(newUser, {
    email: newUser.firstName[0] + newUser.lastName + '@gmail.com',
    currentSpace: null,
    spaces: []
  });
  var user = new User(newUser);
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
    hourlyRate: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    location: [
      [37.796239, -122.405177],
      [37.794004, -122.404725],
      [37.793082, -122.408647],
      [37.794015, -122.401276],
      [37.794257, -122.406321],
      [37.794862, -122.403208],

      [37.796149, -122.405929],
      [37.794174, -122.403365],
      [37.796344, -122.411809],
      [37.792054, -122.409159],
      [37.793962, -122.401348],
      [37.797650, -122.400951],

      [37.798845, -122.407099],
      [37.797141, -122.412506],
      [37.797607, -122.401638],
      [37.795835, -122.408343],
      [37.795742, -122.403548],
      [37.792351, -122.406659]
    ]
  };
  async.times(userIds.length, function(n, next) {
    var space = randomObject(spaceOptions);
    space = _.extend(space, {
      occupiedBy: null,
      hourlyRate: 5,
      location: [
        spaceOptions.location[n][1],
        spaceOptions.location[n][0]
      ]
    });
    ParkingSpace.create(space, function(err, space) {
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
