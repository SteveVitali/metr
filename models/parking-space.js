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
  occupiedUntil: Date,
  // False if space occupied or owner has closed spot
  isAvailable: Boolean,
  hourlyRate: Number,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('ParkingSpace', ParkingSpace);
