var mongoose = require('mongoose');

var ParkingSpace = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // The user occupying the space, if any
  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // False if space occupied or owner has closed spot
  isAvailable: Boolean,
  hourlyRate: Number,
  location: [Number], // Longitude, Latitude
  m2xId: String,
  address: {
    number: {
      type: String,
      uppercase: true
    },
    street: {
      type: String,
      uppercase: true
    },
    city: {
      type: String,
      uppercase: true
    },
    state: {
      type: String,
      uppercase: true
    },
    zip: String
  }
});

ParkingSpace.statics.findAvailable = function(callback) {
  return this.find({ isAvailable: true }).exec(callback);
};

ParkingSpace.statics.findByM2xId = function(id, callback) {
  return this.findOne({ m2xId: id }).exec(callback);
};

ParkingSpace.statics.ownedByUser = function(userId, callback) {
  return this.find({ owner: userId }).exec(callback);
};

ParkingSpace.statics.findNearby = function(lng, lat, miles, callback) {
  var EQUATORIAL_RADIUS = 3963.2;
  return this.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat],
          miles / EQUATORIAL_RADIUS
        ]
      }
    }
  }).exec(callback);
};

ParkingSpace.statics.findAvailableNearby = function(lng, lat, miles, callback) {
  var EQUATORIAL_RADIUS = 3963.2;
  return this.find({
    location: {
      $geoWithin: {
        $centerSphere: [
          [lng, lat],
          miles / EQUATORIAL_RADIUS
        ]
      }
    },
    isAvailable: true
  }).exec(callback);
};

module.exports = mongoose.model('ParkingSpace', ParkingSpace);
