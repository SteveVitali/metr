var mongoose = require('mongoose');

var Trip = mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  parkingSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace'
  },
  startTime: Date,
  endTime: Date,
  hourlyRate: Number,
  cost: Number
});

Trip.statics.getUserHistory = function(userId, callback) {
  return this.find({ driver: userId }).exec(callback);
};

Trip.statics.getParkingSpaceHistory = function(spaceId, callback) {
  return this.find({ parkingSpace: spaceId }).exec(callback);
};

module.exports = mongoose.model('Trip', Trip);
