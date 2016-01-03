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
  location: [Number] // Longitude, Latitude
});

ParkingSpace.statics.findAvailable = function(callback) {
  return this.find({ isAvailable: true }).exec(callback);
};

ParkingSpace.statics.findNearby = function(lng, lat, meters, callback) {
  return this.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $minDistance: 0,
        $maxDistance: meters
      }
    }
  }).exec(callback);
};

Parkingspace.statics.findAvailableNearby = function(lng, lat, meters, callback) {
  return this.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $minDistance: 0,
        $maxDistance: meters
      }
    },
    isAvailable: true
  }).exec(callback);
};

module.exports = mongoose.model('ParkingSpace', ParkingSpace);
