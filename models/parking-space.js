var mongoose = require('mongoose');

var ParkingSpace = mongoose.Schema({
  deviceID: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // The user occupying the space, if any
  occupiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // False if space occupied or owner has closed spot
  isAvailable: {
    type: Boolean,
    default: true
  },
  hourlyRate: Number,
  location: [Number], // Longitude, Latitude
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

ParkingSpace.statics.ownedByUser = function(userId, callback) {
  return this.find({ owner: userId }).exec(callback);

//M2X ID.
ParkingSpace.statics.findByDeviceID = function(deviceID, callback) {
  return this.find({ deviceID: deviceID }).exec(callback);
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

ParkingSpace.statics.findAvailableNearby = function(lng, lat, meters, callback) {
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
