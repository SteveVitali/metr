var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  currentSpace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace'
  },
  spaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSpace'
  }]
});

User.statics.findByEmail = function(email, callback) {
  return this.findOne({ email: email }).exec(callback);
};

User.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', User);
