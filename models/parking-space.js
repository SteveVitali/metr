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
  occupiedAt: Date,
  hourlyRate: Number,
  location: [Number], // [Longitude, Latitude]
  address: {
    city: String,
    zip: String,
    state: String, // code,
    country: String, // code,
    fullAddress: String,
    house: String,
    streetName: String,
    streetType: String,
    streetDirection: String,
    aptNumber: String,
    latitude: Number,
    longitude: Number,
    line1: String,
    line2: String,
    line3: String
  }
});

ParkingSpace.statics.findAvailable = function(callback) {
  return this.find({ isAvailable: true }).exec(callback);
};

ParkingSpace.statics.ownedByUser = function(userId, callback) {
  return this
    .find({ owner: userId })
    .populate('owner')
    .populate('occupiedBy')
    .exec(callback);
};

// M2X ID.
ParkingSpace.statics.findByDeviceID = function(deviceID, callback) {
  return this.findOne({ deviceID: deviceID }).exec(callback);
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
  })
  .populate('owner')
  .populate('occupiedBy')
  .exec(callback);
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
  })
  .populate('owner')
  .populate('occupiedBy')
  .exec(callback);
};

module.exports = mongoose.model('ParkingSpace', ParkingSpace);
